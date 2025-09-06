const request = require('supertest');
const express = require('express');
const postRoutes = require('../routes/posts');
const { initDatabase } = require('../database/database');
const { errorHandler } = require('../middleware/errorHandler');

// 테스트용 앱 생성
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/posts', postRoutes);
  app.use(errorHandler);
  return app;
};

describe('Posts API', () => {
  let app;

  beforeAll(async () => {
    // 테스트 환경 설정
    process.env.NODE_ENV = 'test';
    app = createTestApp();
    await initDatabase();
  });

  describe('GET /api/posts', () => {
    test('should return posts with pagination', async () => {
      const response = await request(app)
        .get('/api/posts?page=0&size=5')
        .expect(200);

      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('totalElements');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body.size).toBe(5);
      expect(response.body.number).toBe(0);
      expect(Array.isArray(response.body.content)).toBe(true);
    });

    test('should handle invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/posts?page=-1')
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('POST /api/posts', () => {
    test('should create a new post', async () => {
      const newPost = {
        title: 'Test Post',
        content: 'This is a test post content.',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body.author).toBe(newPost.author);
    });

    test('should return 400 for missing required fields', async () => {
      const invalidPost = {
        title: 'Test Post'
        // missing content and author
      };

      const response = await request(app)
        .post('/api/posts')
        .send(invalidPost)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details).toBeDefined();
    });

    test('should return 400 for empty title', async () => {
      const invalidPost = {
        title: '',
        content: 'Content',
        author: 'Author'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(invalidPost)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /api/posts/:id', () => {
    test('should return a specific post', async () => {
      // First create a post
      const newPost = {
        title: 'Specific Test Post',
        content: 'Content for specific test',
        author: 'Specific Author'
      };

      const createResponse = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      const postId = createResponse.body.id;

      // Then get the post
      const response = await request(app)
        .get(`/api/posts/${postId}`)
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe(newPost.title);
    });

    test('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/posts/99999')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    test('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/api/posts/invalid-id')
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('PUT /api/posts/:id', () => {
    test('should update an existing post', async () => {
      // Create a post first
      const newPost = {
        title: 'Original Title',
        content: 'Original Content',
        author: 'Original Author'
      };

      const createResponse = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      const postId = createResponse.body.id;

      // Update the post
      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content'
      };

      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
      expect(response.body.author).toBe(newPost.author); // author should remain unchanged
    });

    test('should return 404 for updating non-existent post', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content'
      };

      const response = await request(app)
        .put('/api/posts/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    test('should return 400 for invalid update data', async () => {
      const createResponse = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'Test Content',
          author: 'Test Author'
        })
        .expect(201);

      const postId = createResponse.body.id;

      const invalidUpdateData = {
        title: '', // empty title
        content: 'Updated Content'
      };

      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    test('should delete an existing post', async () => {
      // Create a post first
      const newPost = {
        title: 'Post to Delete',
        content: 'This post will be deleted',
        author: 'Delete Author'
      };

      const createResponse = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      const postId = createResponse.body.id;

      // Delete the post
      await request(app)
        .delete(`/api/posts/${postId}`)
        .expect(204);

      // Verify the post is deleted
      await request(app)
        .get(`/api/posts/${postId}`)
        .expect(404);
    });

    test('should return 404 for deleting non-existent post', async () => {
      const response = await request(app)
        .delete('/api/posts/99999')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
    });

    test('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .delete('/api/posts/invalid-id')
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('Input Validation', () => {
    test('should reject title longer than 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      const invalidPost = {
        title: longTitle,
        content: 'Valid content',
        author: 'Valid author'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(invalidPost)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details.some(d => d.field === 'title')).toBe(true);
    });

    test('should reject author longer than 50 characters', async () => {
      const longAuthor = 'a'.repeat(51);
      const invalidPost = {
        title: 'Valid title',
        content: 'Valid content',
        author: longAuthor
      };

      const response = await request(app)
        .post('/api/posts')
        .send(invalidPost)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.details.some(d => d.field === 'author')).toBe(true);
    });

    test('should handle pagination with invalid size', async () => {
      const response = await request(app)
        .get('/api/posts?page=0&size=101') // size > 100
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    test('should use default pagination values', async () => {
      const response = await request(app)
        .get('/api/posts') // no page/size params
        .expect(200);

      expect(response.body.size).toBe(10); // default size
      expect(response.body.number).toBe(0); // default page
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      // This test would need to mock database failures
      // For now, just verify error response format
      const response = await request(app)
        .get('/api/posts/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
import React, { useState, useMemo } from 'react';
import {
  Box,
  List,
  Typography,
  Paper,
  Alert,
  LinearProgress,
  Fab,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircleOutline as EmptyIcon
} from '@mui/icons-material';
import { Todo, FilterType } from '../types/todo';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [nextId, setNextId] = useState(1);

  // 필터링된 할일 목록
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // 상태 필터
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.category && todo.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 우선순위 및 생성일 순 정렬
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // 완료된 항목을 아래로
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || 'medium'];
      const bPriority = priorityOrder[b.priority || 'medium'];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // 높은 우선순위부터
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 최신순
    });
  }, [todos, filter, searchTerm]);

  // 통계 계산
  const totalCount = todos.length;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: nextId,
      createdAt: new Date()
    };
    setTodos(prev => [newTodo, ...prev]);
    setNextId(prev => prev + 1);
    setShowForm(false);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { 
              ...todo, 
              completed: !todo.completed,
              updatedAt: new Date()
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { 
              ...todo, 
              text: newText,
              updatedAt: new Date()
            }
          : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      {/* 헤더 */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          할일 목록
        </Typography>
        
        {/* 진행률 */}
        {totalCount > 0 && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {completedCount}/{totalCount} 완료
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progressPercent} 
              sx={{ height: 4, borderRadius: 2 }} 
            />
          </Box>
        )}
      </Box>

      {/* 할일 추가 폼 */}
      {showForm && (
        <TodoForm onAdd={addTodo} />
      )}

      {/* 필터 */}
      <TodoFilters
        filter={filter}
        searchTerm={searchTerm}
        totalCount={totalCount}
        activeCount={activeCount}
        completedCount={completedCount}
        onFilterChange={setFilter}
        onSearchChange={setSearchTerm}
        onClearCompleted={clearCompleted}
      />

      {/* 할일 목록 */}
      <Paper elevation={1} sx={{ minHeight: 400 }}>
        {filteredTodos.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={6}
            px={2}
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {todos.length === 0
                ? '할일이 없습니다'
                : searchTerm || filter !== 'all'
                ? '조건에 맞는 할일이 없습니다'
                : '표시할 할일이 없습니다'
              }
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 2 }}>
            {filteredTodos.map((todo, index) => (
              <Box key={todo.id}>
                <TodoItem
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
                {index < filteredTodos.length - 1 && (
                  <Divider variant="inset" sx={{ my: 1, ml: 7 }} />
                )}
              </Box>
            ))}
          </List>
        )}
      </Paper>

      {/* 플로팅 액션 버튼 */}
      <Fab
        color="primary"
        aria-label="add todo"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
        onClick={() => setShowForm(!showForm)}
      >
        <AddIcon />
      </Fab>

      {/* 추가 정보 제거 */}
    </Box>
  );
};

export default TodoList;
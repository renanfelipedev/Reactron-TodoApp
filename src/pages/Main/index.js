import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';

import {
  Container,
  NewTodo,
  NewTodoInput,
  Button,
  TodosList,
  Todo,
  TodoName,
  NewTodoMessage
} from './styles';

const { ipcRenderer } = window.require('electron');

export default function Main() {
  const [todos, setTodos] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    const newTodo = event.target.todo.value;

    if (!newTodo) return;

    const todo = {
      id: uuid(),
      name: newTodo
    };

    setTodos([...todos, todo]);

    const message = {
      title: `Um nova tarefa foi criada.`,
      body: `A tarefa ${todo.name} foi criada`
    };

    ipcRenderer.send('@notification/REQUEST', message);

    event.target.reset();
  }

  function handleRemoveTodo(todoId) {
    setTodos(todos.filter(todo => todo.id !== todoId));
  }

  function renderTodos() {
    return (
      <TodosList>
        {todos.map(todo => (
          <Todo key={todo.id}>
            <TodoName>{todo.name}</TodoName>
            <Button onClick={() => handleRemoveTodo(todo.id)}>Concluir</Button>
          </Todo>
        ))}
      </TodosList>
    );
  }

  function handleNotificationFAilure(message) {
    console.log(message);
  }

  useEffect(() => {
    ipcRenderer.on('@notification/FAILURE', handleNotificationFAilure);
    return () => {
      ipcRenderer.removeListener(
        '@notification/FAILURE',
        handleNotificationFAilure
      );
    };
  }, []);

  return (
    <Container>
      <NewTodo onSubmit={handleSubmit}>
        <NewTodoInput
          name='todo'
          placeholder='Adicionar nova tarefa...'
          autoFocus
        />
        <Button>Adicionar</Button>
      </NewTodo>
      {todos.length > 0 ? (
        renderTodos()
      ) : (
        <NewTodoMessage>Adicione uma nova tarefa</NewTodoMessage>
      )}
    </Container>
  );
}

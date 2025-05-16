import React, { useEffect, useState } from 'react';
import { Button, Form, Input, List, Space, Tag, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'concluida';
}

const Tarefas: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filtro, setFiltro] = useState('');
  const { token, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const buscarTarefas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/tarefas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTarefas(res.data);
    } catch (error) {
      message.error('Erro ao buscar tarefas. Faça login novamente.');
      logout();
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const criarTarefa = async (valores: { titulo: string; descricao: string }) => {
    try {
      await axios.post('http://localhost:3001/api/tarefas', valores, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Tarefa criada com sucesso!');
      buscarTarefas();
    } catch (error) {
      message.error('Erro ao criar tarefa.');
    }
  };

  const tarefasFiltradas = tarefas.filter((t) =>
    t.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Olá, {usuario?.nome} 👋
        </Title>
        <Button danger onClick={logout}>
          Sair
        </Button>
      </Space>

      <Form layout="vertical" onFinish={criarTarefa} style={{ marginBottom: 32 }}>
        <Title level={5}>Nova Tarefa</Title>
        <Form.Item
          label="Título"
          name="titulo"
          rules={[{ required: true, message: 'Informe o título' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Descrição"
          name="descricao"
          rules={[{ required: true, message: 'Informe a descrição' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Criar Tarefa
          </Button>
        </Form.Item>
      </Form>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Filtrar por título..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Button onClick={buscarTarefas}>Atualizar</Button>
      </Space>

      <List
        header={<h3>Minhas Tarefas</h3>}
        bordered
        dataSource={tarefasFiltradas}
        renderItem={(tarefa) => (
          <List.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontWeight: 600 }}>{tarefa.titulo}</div>
              <div>{tarefa.descricao}</div>
              <Tag color={tarefa.status === 'concluida' ? 'green' : 'orange'}>
                {tarefa.status}
              </Tag>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Tarefas;

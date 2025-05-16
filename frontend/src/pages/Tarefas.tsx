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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formEditar] = Form.useForm();

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

  const iniciarEdicao = (tarefa: Tarefa) => {
    setEditingId(tarefa.id);
    formEditar.setFieldsValue(tarefa);
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    formEditar.resetFields();
  };

  const salvarEdicao = async (id: number) => {
    try {
      const valores = await formEditar.validateFields();
      await axios.put(`http://localhost:3001/api/tarefas/${id}`, valores, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Tarefa atualizada com sucesso!');
      buscarTarefas();
      cancelarEdicao();
    } catch {
      message.error('Erro ao atualizar tarefa.');
    }
  };

  const deletarTarefa = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await axios.delete(`http://localhost:3001/api/tarefas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Tarefa deletada com sucesso!');
      buscarTarefas();
    } catch {
      message.error('Erro ao deletar tarefa.');
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
          <List.Item
            actions={
              editingId === tarefa.id ? [
                <Button onClick={() => salvarEdicao(tarefa.id)} type="link">Salvar</Button>,
                <Button onClick={cancelarEdicao} type="link">Cancelar</Button>,
              ] : [
                <Button onClick={() => iniciarEdicao(tarefa)} type="link">Editar</Button>,
                <Button onClick={() => deletarTarefa(tarefa.id)} type="link" danger>Excluir</Button>
              ]
            }
          >
            {editingId === tarefa.id ? (
              <Form form={formEditar} layout="vertical" style={{ width: '100%' }}>
                <Form.Item name="titulo" label="Título" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="descricao" label="Descrição" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Form>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ fontWeight: 600 }}>{tarefa.titulo}</div>
                <div>{tarefa.descricao}</div>
                <Tag color={tarefa.status === 'concluida' ? 'green' : 'orange'}>
                  {tarefa.status}
                </Tag>
              </Space>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Tarefas;

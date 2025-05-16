import React, { useEffect, useState } from 'react';
import { Button, Form, Input, List, Modal, Space, Tag, Typography, message } from 'antd';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [form] = Form.useForm();

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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`http://localhost:3001/api/tarefas/${editingTarefa?.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Tarefa atualizada com sucesso!');
      setIsModalVisible(false);
      buscarTarefas();
    } catch (error) {
      message.error('Erro ao atualizar tarefa.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    form.setFieldsValue(tarefa);
    setIsModalVisible(true);
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
            actions={[
              <Button onClick={() => handleEdit(tarefa)} type="link">Editar</Button>,
              <Button onClick={() => deletarTarefa(tarefa.id)} type="link" danger>Excluir</Button>,
            ]}
          >
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

      {/* Modal para editar tarefa */}
      <Modal
        title="Editar Tarefa"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
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
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Informe o status' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tarefas;

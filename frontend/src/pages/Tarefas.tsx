import React, { useEffect, useState } from 'react';
import { Button, Form, Input, List, Modal, Select, Space, Tag, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusOutlined, ReloadOutlined, LogoutOutlined } from '@ant-design/icons';
import '../index.css';

const { Title } = Typography;
const { Option } = Select;

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

  // Busca tarefas do usuário autenticado
  const buscarTarefas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/tarefas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTarefas(res.data);
    } catch (error) {
      message.error('Erro ao buscar tarefas. Faça login novamente.');
      logout();
      navigate('/'); // redireciona para login ao erro
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  // Criação de nova tarefa
  const criarTarefa = async (valores: { titulo: string; descricao: string }) => {
    try {
      await axios.post('http://localhost:3001/api/tarefas', valores, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Tarefa criada com sucesso!');
      form.resetFields();
      buscarTarefas();
    } catch {
      message.error('Erro ao criar tarefa.');
    }
  };

  // Filtra as tarefas exibidas
  const tarefasFiltradas = tarefas.filter(t =>
    t.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  // Salva edição da tarefa
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`http://localhost:3001/api/tarefas/${editingTarefa?.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Tarefa atualizada com sucesso!');
      setIsModalVisible(false);
      form.resetFields();
      buscarTarefas();
    } catch {
      message.error('Erro ao atualizar tarefa.');
    }
  };

  // Cancela edição
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTarefa(null);
  };

  // Abre modal para editar
  const handleEdit = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    form.setFieldsValue(tarefa);
    setIsModalVisible(true);
  };

  // Confirma exclusão com modal
  const deletarTarefa = async (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir esta tarefa?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3001/api/tarefas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success('Tarefa deletada com sucesso!');
          buscarTarefas();
        } catch {
          message.error('Erro ao deletar tarefa.');
        }
      },
    });
  };

  return (
    <div className="tarefas-container" style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4}>Olá, {usuario?.nome} 👋</Title>
        <Button icon={<LogoutOutlined />} danger onClick={() => { logout(); navigate('/'); }}>
          Sair
        </Button>
      </Space>

      {/* Formulário criação tarefa */}
      <Form layout="vertical" form={form} onFinish={criarTarefa} style={{ marginBottom: 32 }}>
        <Title level={5}>Criar Nova Tarefa</Title>
        <Form.Item
          label="Título"
          name="titulo"
          rules={[{ required: true, message: 'Informe o título' }]}
        >
          <Input placeholder="Título da tarefa" />
        </Form.Item>
        <Form.Item
          label="Descrição"
          name="descricao"
          rules={[{ required: true, message: 'Informe a descrição' }]}
        >
          <Input.TextArea rows={3} placeholder="Descrição detalhada" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Criar Tarefa
          </Button>
        </Form.Item>
      </Form>

      {/* Filtro e atualização */}
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Filtrar por título..."
          allowClear
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ width: 300 }}
        />
        <Button icon={<ReloadOutlined />} onClick={buscarTarefas}>
          Atualizar
        </Button>
      </Space>

      {/* Listagem das tarefas */}
      <List
        header={<Title level={5}>Minhas Tarefas</Title>}
        bordered
        dataSource={tarefasFiltradas}
        locale={{ emptyText: 'Nenhuma tarefa encontrada' }}
        renderItem={(tarefa) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(tarefa)} key="edit">
                Editar
              </Button>,
              <Button type="link" danger onClick={() => deletarTarefa(tarefa.id)} key="delete">
                Excluir
              </Button>,
            ]}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontWeight: 600 }}>{tarefa.titulo}</div>
              <div>{tarefa.descricao}</div>
              <Tag color={tarefa.status === 'concluida' ? 'green' : 'orange'}>
                {tarefa.status === 'concluida' ? 'Concluída' : 'Pendente'}
              </Tag>
            </Space>
          </List.Item>
        )}
      />

      {/* Modal edição tarefa */}
      <Modal
        title="Editar Tarefa"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" initialValues={editingTarefa ?? undefined}>
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
            <Select placeholder="Selecione o status">
              <Option value="pendente">Pendente</Option>
              <Option value="concluida">Concluída</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tarefas;

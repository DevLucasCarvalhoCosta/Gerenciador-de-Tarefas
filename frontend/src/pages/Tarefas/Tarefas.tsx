import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  message,
} from 'antd';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;
const { Option } = Select;

interface FormValues {
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
}

const Tarefas: React.FC = () => {
  const [form] = Form.useForm();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const criarTarefa = async (values: FormValues) => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:3001/api/tarefas',
        { ...values, status: 'pendente' }, // força status pendente
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Tarefa criada com sucesso!');
      form.resetFields();
    } catch (error) {
      message.error('Erro ao criar tarefa. Faça login novamente.');
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Title level={3} style={{ marginBottom: 24, color: '', textAlign: 'center' }}>
        Criar Nova Tarefa
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={criarTarefa}
        initialValues={{ prioridade: 'baixa' }}
      >
        <Form.Item
          label="Título"
          name="titulo"
          rules={[{ required: true, message: 'Informe o título da tarefa' }]}
        >
          <Input placeholder="Título da tarefa" />
        </Form.Item>

        <Form.Item
          label="Descrição"
          name="descricao"
          rules={[{ required: true, message: 'Informe a descrição da tarefa' }]}
        >
          <Input.TextArea rows={4} placeholder="Descrição detalhada" />
        </Form.Item>

        <Form.Item
          label="Prioridade"
          name="prioridade"
          rules={[{ required: true, message: 'Selecione a prioridade' }]}
        >
          <Select>
            <Option value="baixa">Baixa</Option>
            <Option value="media">Média</Option>
            <Option value="alta">Alta</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Criar Tarefa
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Tarefas;

import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Tag,
  message,
  Modal,
  Input,
  Form,
  Select,
  Tooltip,
  Spin,
  Button,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import api from '../../api/axios';
import styles from '../../styles/KanbanTarefas.module.css';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  prioridade?: 'baixa' | 'media' | 'alta';
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<Tarefa['status'], string> = {
  pendente: 'Pendentes',
  em_andamento: 'Em Andamento',
  concluida: 'Concluídas',
};

const prioridadeColorMap = {
  alta: '#eb5a46',
  media: '#ffab4a',
  baixa: '#61bd4f',
};

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString();
};

const KanbanTarefas: React.FC = () => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);
  const [prioridadeLoading, setPrioridadeLoading] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtros, setFiltros] = useState({ pendente: '', em_andamento: '', concluida: '' });
  const [form] = Form.useForm();

  const prioridadeToNum = (p?: Tarefa['prioridade']) =>
    p === 'alta' ? 3 : p === 'media' ? 2 : p === 'baixa' ? 1 : 0;

  const fetchTarefas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Tarefa[]>('/tarefas');
      setTarefas(res.data);
    } catch {
      message.error('Erro ao buscar tarefas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchTarefas();
  }, [token, fetchTarefas]);

  const deleteTarefa = useCallback(
    async (id: number) => {
      try {
        await api.delete(`/tarefas/${id}`);
        message.success('Tarefa deletada com sucesso!');
        fetchTarefas();
      } catch {
        message.error('Erro ao deletar tarefa');
      }
    },
    [fetchTarefas]
  );

  const updateStatus = useCallback(
    async (id: number, status: Tarefa['status']) => {
      try {
        await api.put(`/tarefas/${id}`, { status });
        message.success('Status atualizado');
        fetchTarefas();
      } catch {
        message.error('Erro ao atualizar status');
      }
    },
    [fetchTarefas]
  );

  const updatePrioridade = useCallback(
    async (id: number, prioridade: Tarefa['prioridade']) => {
      setPrioridadeLoading(id);
      try {
        await api.put(`/tarefas/${id}`, { prioridade });
        message.success('Prioridade atualizada');
        fetchTarefas();
      } catch {
        message.error('Erro ao atualizar prioridade');
      } finally {
        setPrioridadeLoading(null);
      }
    },
    [fetchTarefas]
  );

  const colunas: Record<Tarefa['status'], Tarefa[]> = {
    pendente: [],
    em_andamento: [],
    concluida: [],
  };
  (Object.keys(colunas) as Tarefa['status'][]).forEach((status) => {
    colunas[status] = tarefas
      .filter(
        (t) =>
          t.status === status &&
          t.titulo.toLowerCase().includes(filtros[status].toLowerCase())
      )
      .sort((a, b) => prioridadeToNum(b.prioridade) - prioridadeToNum(a.prioridade));
  });

  const onCreate = useCallback(
    async (values: { titulo: string; descricao: string }) => {
      try {
        await api.post('/tarefas', { ...values, status: 'pendente', prioridade: 'baixa' });
        message.success('Tarefa criada com sucesso!');
        form.resetFields();
        setModalVisible(false);
        fetchTarefas();
      } catch {
        message.error('Erro ao criar tarefa');
      }
    },
    [fetchTarefas, form]
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    )
      return;
    updateStatus(Number(draggableId), destination.droppableId as Tarefa['status']);
  };

  return (
    <div className={`${styles.appContainer} ${theme === 'dark' ? styles.darkMode : ''}`}>
      <div className={styles.boardPanel}>
        <Title level={3} className={styles.pageTitle}>
          Quadro de Tarefas
        </Title>

        {loading ? (
          <Spin size="large" />
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.kanbanWrapper}>
              {(Object.keys(colunas) as Tarefa['status'][]).map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <section
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={styles.kanbanColumn}
                      aria-label={`Coluna ${statusLabels[status]}`}
                    >
                      <h4>{statusLabels[status]}</h4>

                      <Search
                        placeholder={`Buscar em ${statusLabels[status]}...`}
                        allowClear
                        onSearch={(value) =>
                          setFiltros((prev) => ({ ...prev, [status]: value }))
                        }
                        style={{ marginBottom: 12 }}
                      />

                      {status === 'pendente' && (
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => setModalVisible(true)}
                          block
                          className={styles.kanbanNewTaskBtn}
                          style={{ marginBottom: 12 }}
                        >
                          Nova Tarefa
                        </Button>
                      )}

                      {colunas[status].map((tarefa, idx) => (
                        <Draggable key={tarefa.id} draggableId={`${tarefa.id}`} index={idx}>
                          {(prov, snap) => (
                            <article
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`${styles.kanbanCard} ${
                                snap.isDragging ? styles.dragging : ''
                              }`}
                              style={prov.draggableProps.style}
                            >
                              <div className={styles.cardContent}>
                                <strong>{tarefa.titulo}</strong>
                                <p>{tarefa.descricao}</p>
                                <p className={styles.timestamp}>
                                  Criado: {formatDateTime(tarefa.createdAt)}<br />
                                  Atualizado: {formatDateTime(tarefa.updatedAt)}
                                </p>
                                <div className={styles.cardFooter}>
                                  <Tag
                                    color={prioridadeColorMap[tarefa.prioridade ?? 'baixa']}
                                  >
                                    {tarefa.prioridade?.toUpperCase() ?? 'BAIXA'}
                                  </Tag>
                                  <Tooltip title="Alterar prioridade">
                                    <Select
                                      value={tarefa.prioridade || 'baixa'}
                                      onChange={(p) => updatePrioridade(tarefa.id, p)}
                                      disabled={prioridadeLoading === tarefa.id}
                                      popupMatchSelectWidth={false}
                                      style={{ width: 80 }}
                                    >
                                      <Option value="alta" label="Alta">
                                        <Tag color={prioridadeColorMap.alta}>Alta</Tag>
                                      </Option>
                                      <Option value="media" label="Média">
                                        <Tag color={prioridadeColorMap.media}>Média</Tag>
                                      </Option>
                                      <Option value="baixa" label="Baixa">
                                        <Tag color={prioridadeColorMap.baixa}>Baixa</Tag>
                                      </Option>
                                    </Select>
                                  </Tooltip>
                                </div>
                              </div>

                              <Button
                                type="default"
                                onClick={() =>
                                  Modal.confirm({
                                    title: 'Confirma exclusão?',
                                    content: `Deseja realmente excluir "${tarefa.titulo}"?`,
                                    okText: 'Sim',
                                    okType: 'danger',
                                    cancelText: 'Não',
                                    onOk: () => deleteTarefa(tarefa.id),
                                  })
                                }
                                className={styles.kanbanDeleteIcon}
                                icon={<DeleteOutlined />}
                              />
                            </article>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </section>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}

        <Modal
          title="Criar Nova Tarefa"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          okText="Criar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical" onFinish={onCreate}>
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
              <Input.TextArea rows={3} placeholder="Descrição detalhada" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default KanbanTarefas;
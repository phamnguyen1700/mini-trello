import { db } from '@/config/firebase';
import { ITaskDocument, mapTaskFromDoc } from '@/models/task.model';
import { Task, TaskStatus, TaskPriority, UpdateTaskDto } from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'tasks';

export const TaskRepo = {
  async create(
    data: Omit<ITaskDocument, 'createdAt' | 'updatedAt'>,
  ): Promise<Task> {
    const now = Timestamp.now();
    const docData: ITaskDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection(COLLECTION).add(docData);
    return mapTaskFromDoc(ref.id, docData);
  },

  async findAllByCard(cardId: string): Promise<Task[]> {
    const snap = await db
      .collection(COLLECTION)
      .where('cardId', '==', cardId)
      .get();

    return snap.docs.map((doc) =>
      mapTaskFromDoc(doc.id, doc.data() as ITaskDocument),
    );
  },

  async findById(taskId: string): Promise<Task | null> {
    const doc = await db.collection(COLLECTION).doc(taskId).get();
    if (!doc.exists) return null;
    return mapTaskFromDoc(doc.id, doc.data() as ITaskDocument);
  },

  async update(taskId: string, dto: UpdateTaskDto): Promise<Task> {
    const updateData: Partial<ITaskDocument> & { updatedAt: Timestamp } = {
      updatedAt: Timestamp.now(),
    };

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.priority !== undefined)
      updateData.priority = dto.priority as TaskPriority;
    if (dto.status !== undefined) updateData.status = dto.status as TaskStatus;
    if (dto.deadline !== undefined)
      updateData.deadline = Timestamp.fromDate(dto.deadline);

    await db.collection(COLLECTION).doc(taskId).update(updateData);
    const doc = await db.collection(COLLECTION).doc(taskId).get();
    return mapTaskFromDoc(doc.id, doc.data() as ITaskDocument);
  },

  async assign(taskId: string, memberId: string): Promise<Task> {
    await db.collection(COLLECTION).doc(taskId).update({
      assignedTo: memberId,
      updatedAt: Timestamp.now(),
    });
    const doc = await db.collection(COLLECTION).doc(taskId).get();
    return mapTaskFromDoc(doc.id, doc.data() as ITaskDocument);
  },

  async move(
    taskId: string,
    dto: { cardId: string; position: number },
  ): Promise<Task> {
    await db.collection(COLLECTION).doc(taskId).update({
      cardId: dto.cardId,
      position: dto.position,
      updatedAt: Timestamp.now(),
    });
    const doc = await db.collection(COLLECTION).doc(taskId).get();
    return mapTaskFromDoc(doc.id, doc.data() as ITaskDocument);
  },

  async delete(taskId: string): Promise<void> {
    await db.collection(COLLECTION).doc(taskId).delete();
  },
};


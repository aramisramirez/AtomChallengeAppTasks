export interface Task {
  id?: string;
  userEmail: string;
  title: string;
  description: string;
  createdAt: FirebaseFirestore.Timestamp;
  completed: boolean;
}

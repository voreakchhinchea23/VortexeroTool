export type ToolCategory = 
  | 'all'
  | 'productivity'
  | 'security'
  | 'web'
  | 'text'
  | 'design'
  | 'developer';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  badge?: 'Popular' | 'New' | 'Featured' | 'Hot';
  tags: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}

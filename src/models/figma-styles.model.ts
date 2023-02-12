export interface User {
  id: string;
  handle: string;
  img_url: string;
}

export interface Style {
  key: string;
  file_key: string;
  node_id: string;
  style_type: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  user: User;
  sort_position: string;
}

export interface Meta {
  styles: Style[];
}

export interface StylesApi {
  error: boolean;
  status: number;
  meta: Meta;
  i18n?: any;
}

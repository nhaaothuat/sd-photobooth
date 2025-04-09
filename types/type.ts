export type Booth = {
  id: number;
  boothName: string;
  status: boolean;
  createdAt: string;
  location: {
    locationName: string;
    address: string;
  };
};

export type Frame = {
  id: number;
  name: string;
  frameUrl: string;
  frameStyleName: string;
  slotCount: number;
  createdAt: string;
};

export type Sticker = {
  id: number
  name: string
  stickerUrl: string
  stickerStyleName: string
  createdAt: string
  lastModified: string
  createdById: number | null
  lastModifiedById: number | null
}

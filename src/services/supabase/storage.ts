// Storage service stub.
export interface StorageService {
  upload(bucket: string, path: string, file: File): Promise<{ url: string }>;
  remove(bucket: string, path: string): Promise<void>;
}

export const storageService: StorageService = {
  async upload(_bucket, path, file) {
    return { url: URL.createObjectURL(file) + `#${path}` };
  },
  async remove() {},
};

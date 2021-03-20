import { existsSync, PathLike, statSync } from 'fs';

const isFile = (path: PathLike) => statSync(path).isFile();
const isDirectory = (path: PathLike) => statSync(path).isDirectory();

export const fileExists = (filePath: string): boolean => {
  if (existsSync(filePath) && isFile(filePath)) {
    return true;
  }

  if (existsSync(filePath) && isDirectory(filePath)) {
    throw new Error(`File '${filePath}' is a directory but should be a file.`);
  }

  return false;
};

export const fileDoesNotExist = (filePath: string): boolean => {
  return !fileExists(filePath);
};

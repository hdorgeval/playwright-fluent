import { existsSync, mkdirSync, PathLike, readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';

const isFile = (path: PathLike) => statSync(path).isFile();
const isDirectory = (path: PathLike) => statSync(path).isDirectory();
const lastModifiedDate = (path: PathLike) => statSync(path).mtime;
const ignoreNodeModule = (path: string) => path.indexOf('node_modules') < 0;
const ignoreDotDir = (path: string) => path.startsWith('.') === false;

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

export const getFilesInDirectory = (
  path: PathLike,
  fileFilter?: (path: string) => boolean,
): string[] =>
  readdirSync(path)
    .map((name) => join(path.toString(), name))
    .filter(isFile)
    .filter(ignoreNodeModule)
    .filter(ignoreDotDir)
    .filter(fileFilter || (() => true));

export const getFilesOlderThanInDirectory = (
  path: PathLike,
  durationInSeconds: number,
  fileFilter?: (path: string) => boolean,
): string[] =>
  getFilesInDirectory(path, fileFilter).filter((filepath) => {
    const modifiedDate = lastModifiedDate(filepath);
    const elapsedTimeInSeconds = (new Date().getTime() - modifiedDate.getTime()) * 1000;
    return elapsedTimeInSeconds > durationInSeconds;
  });

export const deleteFile = (path: string): void => {
  if (fileExists(path)) {
    unlinkSync(path);
  }
};

export const ensureDirectoryExists = (directoryPath: string): void => {
  if (existsSync(directoryPath)) {
    return;
  }
  mkdirSync(directoryPath);
};

export const userHomeDirectory = process.env.HOME || process.env.USERPROFILE;

interface ModuleType {
  setArray?: Function;
  onRuntimeInitialized?: () => void;
  onAbort?: (error: any) => void;
}

declare global {
  interface Window {
    Module: ModuleType;
  }
}

export const loadSegmentTreeModule = () => {
  return new Promise((resolve, reject) => {
    if (window.Module && window.Module.setArray) {
      resolve(window.Module);
      return;
    }

    window.Module = {
      onRuntimeInitialized: () => {
        if (window.module.setArray) {
          resolve(window.Module);
        } else {
          reject(new Error('Module functions are not available'));
        }
      },
      onAbord: (err) => {
        reject(new Error('Module initialization aborted.'));
      },
    };
  })
}
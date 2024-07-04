import React, { useEffect } from 'react';

interface DialogProps {
  content: React.ReactNode;
  header?: React.ReactNode;
  headerText?: string;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  showBottom?: boolean;
  isOpen: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  content,
  headerText,
  header,
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  showBottom = true,
  isOpen
}) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={ `fixed inset-0 z-20 overflow-y-auto transition-opacity duration-300 ease-in-out ${ isOpen ? 'opacity-100' : 'opacity-0' }` }
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-2 pb-20 text-center sm:block sm:p-0" >
        <div onClick={ onCancel } className={ `fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity ${ isOpen ? 'opacity-100' : 'opacity-0'
          }` } aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          className={ `inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[40vw] sm:w-full ${ isOpen
            ? 'opacity-100 translate-y-0 sm:scale-100'
            : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            }` }
        >
          <div className="bg-white px-6 pt-2 sm:pt-6 pb-4 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 sm:mt-0 sm:text-left">{
                header ? header : <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{ headerText }</h3>
              }
                {
                  !showBottom && (
                    <div className='absolute top-4 right-6 cursor-pointer font-bold text-2xl' onClick={ onCancel }>x</div>)
                }
                <div className="mt-2">
                  { content }
                </div>
              </div>
            </div>
          </div>
          { showBottom && (
            <div className="bg-gray-50 px-2 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={ onOk }
              >
                { okText }
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={ onCancel }
              >
                { cancelText }
              </button>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default Dialog;

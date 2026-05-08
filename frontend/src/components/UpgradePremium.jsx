import React from 'react'
import { Link } from 'react-router-dom';


const UpgradePremium = ({ isOpen, onClose }) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold ml-2">Upgrade to premium</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          ></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-center">
              To get access to premium features, please connect with the
              developers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-2 mt-7">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-outline"
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/kreeti-sharma-353072195/",
                  "_blank",

                )
              }
            >
              Connect To Developer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePremium
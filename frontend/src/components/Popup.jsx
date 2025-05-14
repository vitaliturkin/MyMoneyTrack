import React from "react";

function Popup({ message, onConfirm, onCancel }) {
    return (
        <div id="popup">
            <div className="popup-block popup-active">
                <div className="popup-text">{message}</div>
                <div className="main-page-item-options justify-content-center">
                    <button className="main-page-item-options-edit btn btn-success me-2" onClick={onConfirm}>
                        Yes, Delete
                    </button>
                    <button className="main-page-item-options-delete btn btn-danger" onClick={onCancel}>
                        No, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Popup;

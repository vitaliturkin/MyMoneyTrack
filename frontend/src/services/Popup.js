export const getPopupMessage = (deleteType) => {
    const messages = {
        operation: "Are you sure you want to delete this operation?",
        income: "Are you sure you want to delete this income category?",
        expense: "Are you sure you want to delete this expense category?",
    };

    return messages[deleteType] || "Are you sure you want to delete this?";
};

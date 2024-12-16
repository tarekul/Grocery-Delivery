export const handleFormChange = (dependencies) => {
    const { setForm, form } = dependencies;
    
    return (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
};
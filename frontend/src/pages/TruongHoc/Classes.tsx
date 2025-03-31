import { useState } from "react";

export default function ClassesPage() {
    const [classes, setClasses] = useState([
        { id: 1, name: "Class 1" },
        { id: 2, name: "Class 2" },
        { id: 3, name: "Class 3" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");

    const addNewClass = () => {
        if (newClassName.trim() === "") return;
        const newId = classes.length + 1;
        setClasses([...classes, { id: newId, name: newClassName }]);
        setNewClassName("");
        setIsModalOpen(false);
    };

    const deleteClass = (id: number) => {
        setClasses(classes.filter((cls) => cls.id !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lớp Học</h1>
            <div className="grid grid-cols-3 gap-4">
                {/* Nút mở popup */}
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md h-20">
                    + Thêm Lớp Học
                </button>

                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                        <div className="text-lg font-medium">{cls.name}</div>
                        <button className="px-4 py-1 bg-yellow-500 text-white rounded-lg">Xem chi tiết</button>
                        <button onClick={() => deleteClass(cls.id)} className="px-4 py-1 bg-red-500 text-white rounded-lg">
                            Xoá
                        </button>
                    </div>
                ))}
            </div>

            {/* Popup thêm lớp */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thêm Lớp Mới</h2>
                        <input type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="border p-2 w-full mb-4" placeholder="Nhập tên lớp" />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                                Huỷ
                            </button>
                            <button onClick={addNewClass} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

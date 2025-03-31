import React from "react";

const AddBranch: React.FC = () => {
    return (
        <div className="overflow-x-auto w-full">
            <div className="flex flex-col justify-between items-center ">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add Branch</h2>
                <input type="text" placeholder="Billing Name" className="border p-2 rounded" />
                <input type="text" placeholder="Address" className="border p-2 rounded" />
                <input type="text" placeholder="Organization Website" className="border p-2 rounded" />
                <input type="text" placeholder="State" className="border p-2 rounded" />
                <input type="text" placeholder="Time-zone" className="border p-2 rounded" />
                <input type="text" placeholder="District" className="border p-2 rounded" />
                <input type="email" placeholder="Email" className="border p-2 rounded" />
                <input type="text" placeholder="Country" className="border p-2 rounded" />
                <input type="text" placeholder="Contact number" className="border p-2 rounded" />
                <input type="text" placeholder="Pincode" className="border p-2 rounded" />
                <input type="text" placeholder="Registration Number" className="border p-2 rounded" />
                <input type="text" placeholder="Tax Number" className="border p-2 rounded" />
                <input type="text" placeholder="Organization Code" className="border p-2 rounded" />
                <input type="text" placeholder="GST Info" className="border p-2 rounded" />
                <button className="col-span-2 bg-yellow-500 text-black py-2 px-4 rounded w-24">Save</button>
            </div>
        </div>
    );
};

export default AddBranch;

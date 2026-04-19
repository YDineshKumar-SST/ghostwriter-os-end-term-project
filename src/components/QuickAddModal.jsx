import React, { useState, useEffect } from 'react';

const QuickAddModal = ({ onClose, onSave, post }) => {
  const [title, setTitle] = useState(post ? post.title : '');
  const [platform, setPlatform] = useState(post ? post.platform : '');
  const [status, setStatus] = useState(post ? post.status : 'Draft');
  const [description, setDescription] = useState(post ? post.description : '');
  const [priority, setPriority] = useState(post ? post.priority : 'Medium');
  const [dueDate, setDueDate] = useState(post ? post.dueDate : new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setPlatform(post.platform);
      setStatus(post.status);
      setDescription(post.description || '');
      setPriority(post.priority || 'Medium');
      setDueDate(post.dueDate || new Date().toISOString().split('T')[0]);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      ...post,
      title,
      platform,
      status,
      description,
      priority,
      dueDate,
      date: post ? post.date : new Date().toISOString().split('T')[0],
    };
    onSave(newPost);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{post ? 'Edit Post' : 'Add New Draft'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Platform</option>
              <option value="Hashnode">Hashnode</option>
              <option value="Dev.to">Dev.to</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the draft or completion goal"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              {post ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
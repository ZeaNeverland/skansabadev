// pages/AdminDashboard.tsx
import { useState } from "react";

// Tipe data
interface News {
  id: number;
  title: string;
  content: string;
}

interface Facility {
  id: number;
  name: string;
  description: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  year: number;
}

const AdminDashboard = () => {
  // State data
  const [news, setNews] = useState<News[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Input sementara
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // --- Fungsi CRUD untuk Berita ---
  const addNews = () => {
    const newItem: News = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
    };
    setNews([...news, newItem]);
    setNewTitle("");
    setNewContent("");
  };

  const editNews = (id: number, updatedTitle: string, updatedContent: string) => {
    setNews(news.map((item) =>
      item.id === id ? { ...item, title: updatedTitle, content: updatedContent } : item
    ));
  };

  const deleteNews = (id: number) => {
    setNews(news.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Form tambah berita */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tambah Berita</h2>
        <input
          type="text"
          placeholder="Judul"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Isi berita"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={addNews} className="bg-blue-500 text-white px-4 py-2 rounded">
          Tambah
        </button>
      </div>

      {/* Daftar berita */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Daftar Berita</h2>
        {news.length === 0 ? (
          <p>Tidak ada berita</p>
        ) : (
          news.map((item) => (
            <div key={item.id} className="border p-2 mb-2 rounded">
              <h3 className="font-bold">{item.title}</h3>
              <p>{item.content}</p>
              <button
                onClick={() => editNews(item.id, item.title + " (Edited)", item.content)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNews(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import MoodDiscoverySection from '../../components/mood/MoodDiscoverySection.jsx';

export default function MoodDiscoveryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Khám phá theo Tâm trạng & Ngữ cảnh
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Chọn một tâm trạng hoặc ngữ cảnh để nhận ngay các giai điệu và danh sách phát được tuyển chọn đặc biệt.
        </p>
      </div>

      <MoodDiscoverySection initialTag="chill" />
    </div>
  );
}

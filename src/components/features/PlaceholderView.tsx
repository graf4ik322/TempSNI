import React, { useState } from 'react';
import { Plus, Edit, Trash2, Maximize } from 'lucide-react';
import { useApp } from '../../stores/AppContext';
import { Button } from '../ui/Button';
import { PlaceholderConfig } from '../../types';

export function PlaceholderView() {
  const { state, addPlaceholder, deletePlaceholder } = useApp();
  const { config, theme } = state;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaceholderName, setNewPlaceholderName] = useState('');

  const handleCreatePlaceholder = () => {
    if (newPlaceholderName.trim()) {
      addPlaceholder({
        name: newPlaceholderName,
        type: 'text',
        content: { text: 'Новый placeholder' },
        styling: {
          backgroundColor: theme.colors.background,
          textColor: theme.colors.text,
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
        },
      });
      setNewPlaceholderName('');
      setShowCreateForm(false);
    }
  };

  const handleDeletePlaceholder = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот placeholder?')) {
      deletePlaceholder(id);
    }
  };

  const renderPlaceholderPreview = (placeholder: PlaceholderConfig) => {
    const { content, styling } = placeholder;

    return (
      <div
        className="w-full h-32 flex items-center justify-center rounded-lg border-2 border-dashed"
        style={{
          backgroundColor: styling.backgroundColor,
          color: styling.textColor,
          fontSize: styling.fontSize,
          fontFamily: styling.fontFamily,
          borderColor: theme.colors.secondary,
        }}
      >
        {content.text || 'Пустой текст'}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Мои Placeholder</h1>
          <p style={{ color: theme.colors.text + '80' }}>
            Создавайте и управляйте своими placeholder для различных целей
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus size={20} className="mr-2" />
          Создать Placeholder
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.secondary,
          }}
        >
          <h3 className="text-lg font-semibold mb-3">Создать новый Placeholder</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newPlaceholderName}
              onChange={(e) => setNewPlaceholderName(e.target.value)}
              placeholder="Введите название placeholder"
              className="flex-1 px-3 py-2 border rounded-lg"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.secondary,
              }}
            />
            <Button onClick={handleCreatePlaceholder}>
              Создать
            </Button>
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
              Отмена
            </Button>
          </div>
        </div>
      )}

      {/* Placeholders Grid */}
      {config.placeholders.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg border-2 border-dashed"
          style={{ borderColor: theme.colors.secondary }}
        >
          <div className="max-w-md mx-auto">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              <Plus size={32} style={{ color: theme.colors.text }} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Нет placeholder</h3>
            <p style={{ color: theme.colors.text + '80' }} className="mb-4">
              Создайте свой первый placeholder для начала работы
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              Создать первый Placeholder
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.placeholders.map((placeholder) => (
            <div
              key={placeholder.id}
              className="rounded-lg border p-4 hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.secondary,
              }}
            >
              {/* Preview */}
              <div className="mb-4">
                {renderPlaceholderPreview(placeholder)}
              </div>

              {/* Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{placeholder.name}</h3>
                <p className="text-sm capitalize" style={{ color: theme.colors.text + '80' }}>
                  Тип: {placeholder.type}
                </p>
                <p className="text-xs" style={{ color: theme.colors.text + '60' }}>
                  Создано: {new Date(placeholder.created).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Edit placeholder:', placeholder.id);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePlaceholder(placeholder.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('Fullscreen view for:', placeholder.id);
                  }}
                >
                  <Maximize size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
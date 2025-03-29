// src/components/MinimalLoader.js
export default function MinimalLoader() {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 9999
      }}>
        <div>Carregando...</div>
      </div>
    );
  }
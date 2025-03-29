import React, { useEffect, useRef, useState } from 'react';

// Importando as logos
import instagramLogo from '../assets/images/instagram.png';
import facebookLogo from '../assets/images/facebook.png';
import whatsappLogo from '../assets/images/whatsapp.png';
import linkedinLogo from '../assets/images/linkedin.png';
import youtubeLogo from '../assets/images/youtube.png';
import tiktokLogo from '../assets/images/tiktok.png';
import kwayLogo from '../assets/images/kway.png';
import xLogo from '../assets/images/x.png';
import twitchLogo from '../assets/images/twitch.png';

const CardPreview = ({ cardData }) => {
  const {
    name,
    instagram,
    facebook,
    whatsapp,
    phone,
    address,
    logo,
    pixKey,
    website,
    about,
    bgColor,
    labelBgColor,
    fontColor,
    bgImage,
    carouselImages,
    linkedin,
    youtube,
    tiktok,
    kway,
    x,
    twitch,
  } = cardData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselIntervalRef = useRef(null);

  const backgroundStyle = {
    backgroundColor: bgColor,
    backgroundImage: bgImage ? `url(${URL.createObjectURL(bgImage)})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    textAlign: 'left',
    width: '100%',  // Ajustando largura para 100%
    maxWidth: '600px',
    margin: '0 auto',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    backgroundColor: labelBgColor || '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '5px',
    margin: '5px 0',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '300px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const nameStyle = {
    textAlign: 'center',
    margin: '20px 0',
    color: fontColor || '#000000',
  };

  const logoStyle = {
    marginTop:'20%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'contain',  // Usando 'contain' para garantir que a imagem não seja cortada
   
  };

  const renderPlatformLink = (url, logo, platformName) => (
    <div style={labelStyle}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: fontColor || '#000000' }}>
        {logo && <img src={logo} alt={platformName} style={{ width: '30px', margin: '0 5px' }} />}
        {platformName}
      </a>
    </div>
  );

  const renderCarousel = () => {
    return (
      <div id="carouselExample" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          {carouselImages.map((image, index) => {
            return image ? (
              <div className={`carousel-item ${index === currentIndex ? 'active' : ''}`} key={index}>
                <img
                  src={URL.createObjectURL(image)}
                  className="d-block w-100"
                  alt={`carousel-image-${index}`}
                  style={{ objectFit: 'cover', maxHeight: '300px', width: '100%' }}
                />
              </div>
            ) : null;
          })}
        </div>
        {carouselImages.some((image) => image) && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
              onClick={() =>
                setCurrentIndex((prevIndex) =>
                  prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
                )
              }
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
              onClick={() =>
                setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
              }
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (carouselImages && carouselImages.length > 0) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 3000);
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [carouselImages]);

  // Função para copiar a chave PIX para a área de transferência
  const handleCopyPixKey = () => {
    if (pixKey) {
      navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave PIX copiada!');
      }).catch((err) => {
        alert('Erro ao copiar a chave PIX: ', err);
      });
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      overflowY: 'auto', 
      marginTop: '1%'  // Adicionando a margem no topo
    }}>
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${URL.createObjectURL(bgImage)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            zIndex: -1,
          }}
        />
      )}
      <div style={backgroundStyle}>
        {logo && (
          <img
            src={URL.createObjectURL(logo)}
            alt="Logo"
            style={logoStyle}
          />
        )}
        <h1 style={nameStyle}>{name || 'Nome não fornecido'}</h1>
        <div style={{ width: '80%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {instagram && renderPlatformLink(instagram, instagramLogo, 'Instagram')}
          {facebook && renderPlatformLink(facebook, facebookLogo, 'Facebook')}
          {whatsapp && renderPlatformLink(`https://wa.me/${whatsapp}`, whatsappLogo, 'WhatsApp')}
          {linkedin && renderPlatformLink(linkedin, linkedinLogo, 'LinkedIn')}
          {youtube && renderPlatformLink(youtube, youtubeLogo, 'YouTube')}
          {tiktok && renderPlatformLink(tiktok, tiktokLogo, 'TikTok')}
          {kway && renderPlatformLink(kway, kwayLogo, 'Kway')}
          {x && renderPlatformLink(x, xLogo, 'X')}
          {twitch && renderPlatformLink(twitch, twitchLogo, 'Twitch')}
          {phone && <div style={labelStyle}><span style={{ color: fontColor || '#000000' }}>Telefone: {phone}</span></div>}
          {address && <div style={labelStyle}><span style={{ color: fontColor || '#000000' }}>Endereço: {address}</span></div>}
          {pixKey && (
            <div style={labelStyle} onClick={handleCopyPixKey}>
              <span style={{ color: fontColor || '#000000' }}>Copiar!</span>
            </div>
          )}
          {website && renderPlatformLink(website, null, 'Website')}
          {about && <div style={labelStyle}><span style={{ color: fontColor || '#000000' }}>{about}</span></div>}
        </div>
        {renderCarousel()}
      </div>
    </div>
  );
};

export default CardPreview;

import React from 'react';
import './SejarahMap.css';

function SejarahMap() {

  return (
    <div className="card-sejarah">
      <div className="card-content">
        <div className="card-map">
          <iframe 
            title='peta' 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19861.51728417338!2d119.53196943299139!3d-5.671034117847816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dca1fb4b9f0fbdd%3A0xc6cd728d6349d499!2sKassi%2C%20Rumbia%2C%20Jeneponto%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1631988141441!5m" 
            width="600" 
            height="450"  
            allowFullScreen="" 
            loading="lazy">
          </iframe>
        </div>
      </div>
    </div>
  );
}

export default SejarahMap;

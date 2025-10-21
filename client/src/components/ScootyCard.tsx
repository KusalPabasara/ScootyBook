import React from 'react';
import { Link } from 'react-router-dom';

interface ScootyCardProps {
  scooty: {
    _id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    fuelType: string;
    pricePerHour: number;
    pricePerDay: number;
    images: string[];
    location: {
      city: string;
      state: string;
    };
    rating: {
      average: number;
      count: number;
    };
  };
}

const ScootyCard: React.FC<ScootyCardProps> = ({ scooty }) => {
  return (
    <div className="card bg-base-100 shadow-xl card-hover">
      <figure>
        {scooty.images && scooty.images.length > 0 ? (
          <img
            src={scooty.images[0]}
            alt={scooty.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-base-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="6" cy="18" r="3" strokeWidth="2" />
              <circle cx="18" cy="18" r="3" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18h12M9 18V8l3-2h5l2 4M14 10h4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h2v2h-2z" />
            </svg>
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {scooty.brand} {scooty.model}
          <div className="badge badge-secondary">{scooty.year}</div>
        </h2>
        <p className="text-sm text-base-content/70">
          {scooty.color} • {scooty.fuelType}
        </p>
        <p className="text-sm text-base-content/70">
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {scooty.location.city}, {scooty.location.state}
        </p>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="rating rating-sm">
            {[...Array(5)].map((_, i) => (
              <input
                key={i}
                type="radio"
                name={`rating-${scooty._id}`}
                className="mask mask-star-2 bg-orange-400"
                checked={i < Math.floor(scooty.rating.average)}
                readOnly
              />
            ))}
          </div>
          <span className="text-sm text-base-content/70">
            ({scooty.rating.count} reviews)
          </span>
        </div>

        <div className="card-actions justify-between items-end">
          <div className="text-lg font-bold">
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>LKR {scooty.pricePerHour}/hr</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>LKR {scooty.pricePerDay}/day</span>
            </div>
          </div>
          <Link
            to={`/scooties/${scooty._id}`}
            className="btn btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScootyCard;
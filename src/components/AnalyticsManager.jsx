import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  captureAttribution,
  initializeTracking,
  trackPageView,
} from '../services/analytics';

const AnalyticsManager = () => {
  const location = useLocation();

  useEffect(() => {
    captureAttribution();
    initializeTracking();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsManager;


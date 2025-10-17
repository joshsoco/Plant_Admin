import React from 'react';
import { PlantDatabaseSidebar } from '@/features/plants/components/PlantDatabaseSidebar';

const PlantDatabase: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="w-96 flex-shrink-0">
        <PlantDatabaseSidebar />
      </div>
      <div className="flex-1 p-6 bg-muted/50">
        <div className="text-center mt-20 text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">Plant Database</h3>
          <p>Manage your plant collection using the sidebar</p>
        </div>
      </div>
    </div>
  );
};

export default PlantDatabase;
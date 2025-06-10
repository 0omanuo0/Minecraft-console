'use client';
import { McServerList } from '@/lib/types';
import React, { createContext, useContext } from 'react';

export const dashboardContext = createContext({
    serversList: [] as McServerList| undefined,
});

export const DashboardProvider = ({ children, data }: { children: React.ReactNode; data: any }) => {
    return <dashboardContext.Provider value={data}>{children}</dashboardContext.Provider>;
};

export const useData = () => useContext(dashboardContext);
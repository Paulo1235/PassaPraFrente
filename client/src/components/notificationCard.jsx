"use client";

import React from "react";
import { Bell, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const NotificationCard = ({ notification, onMarkAsRead }) => {
    
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div
            className={`mb-4 p-4 rounded-lg border ${
                notification.read ? "bg-white border-gray-200" : "bg-[#f5f7e8] border-[#7b892f]"
            } shadow-sm transition-all hover:shadow-md`}
        >
            <ToastContainer />
            <div className="flex items-start">
                <div className="mr-3 mt-1">
                    <Bell className={`h-5 w-5 ${notification.read ? "text-gray-400" : "text-[#7b892f]"}`} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <p className={`font-medium ${notification.read ? "text-txtp" : "text-[#7b892f]"}`}>
                            <a onClick={() => notification.read ? toast.warn("Nenhum link disponivel") : navigate(notification.link)} className="hover:underline cursor-pointer">
                            {notification.message}
                            </a>
                        </p>
                        {!notification.read && onMarkAsRead && (
                            <button
                                onClick={() => {onMarkAsRead(notification.id);}}
                                className="ml-2 p-1 text-[#7b892f] hover:bg-[#f0f2e0] rounded-full"
                                title="Marcar como lida"
                            >
                                <Check className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(notification.date)}</p>
                </div>
            </div>
        </div>
    );
};

export const NotificationList = ({ notifications, onMarkAsRead }) => {
    if (!notifications || notifications.length === 0) {
        return <p className="text-[#7b892f] font-semibold text-lg text-center py-8">Sem Notificações</p>;
    }

    return (
        <div className="space-y-2">
            {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />
            ))}
        </div>
    );
};

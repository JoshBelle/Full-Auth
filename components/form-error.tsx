import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FormErrorProps {
    message?: string;
}

import React from 'react';

export default function FormError({ message }: FormErrorProps) {
    if (!message) return null;
    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm text-destructive gap-2">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    );
}

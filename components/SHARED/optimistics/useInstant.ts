"use client";

import { useOptimistic, useState } from "react";

export default function useInstant<T extends object>(initialData: T) {
    // Use state
    const [data, setData] = useState(initialData);

    // Use optimistic state
    const [optimisticData, setOptimisticData] = useOptimistic(data);

    return { optimisticData, setData, setOptimisticData };
}

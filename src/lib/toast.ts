import { showToast } from "nextjs-toast-notify";

type ToastStatus = "success" | "error" | "info" | "warning";

export function showToastMessage(message: string, status: ToastStatus) {
    const options = {
        duration: 3000,
        progress: true,
        position: "bottom-center",
        transition: "fadeIn",
        icon: "",
        sound: true,
    } as const;

    switch (status) {
        case "success":
            showToast.success(message, options);
            break;
        case "error":
            showToast.error(message, options);
            break;
        case "info":
            showToast.info(message, options);
            break;
        case "warning":
            showToast.warning(message, options);
            break;
        default:
            console.warn("Invalid toast status:", status);
            break;
    }
}

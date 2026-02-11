import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" />
                    <div className="relative bg-card rounded-full p-6 shadow-xl border border-primary/20 flex items-center justify-center">
                        <span className="font-serif italic font-bold text-3xl text-primary">N</span>
                    </div>
                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                        NexaMart
                    </h2>
                    <p className="text-sm tracking-widest uppercase text-muted-foreground animate-pulse">
                        Marketplace
                    </p>
                </div>
            </div>
        </div>
    );
}

interface AppLogoProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function AppLogo({ className, style }: AppLogoProps) {
    return (
        <>
            <img
                src="/favicon.svg"
                alt="Inception Logo"
                className={`size-15 ${className}`}
                style={style}
            />
        </>
    );
}

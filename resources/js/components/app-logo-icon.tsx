import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src={`${window.location.origin}/logo-jadwalin.png`} alt="Logo" height={64} width={64} />
    );
}

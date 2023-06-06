import React, { useEffect, useRef, useState } from 'react';

function YouTubeVideo({ videoId }) {
    const [isLoading, setIsLoading] = useState(true);
    const divRef = useRef();

    useEffect(() => {
        // Assurez-vous que l'API YouTube est chargée
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Créez un nouvel objet YouTube Player quand l'API est prête
        const interval = setInterval(() => {
            if (window.YT && window.YT.Player) {
                new window.YT.Player(divRef.current, {
                    videoId: videoId,
                    events: {
                        onReady: () => setIsLoading(false),
                    },
                });
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [videoId]);

    return (
        <div>
            {isLoading && <div>Loading...</div>}
            <div ref={divRef} />
        </div>
    );
}

export default YouTubeVideo;
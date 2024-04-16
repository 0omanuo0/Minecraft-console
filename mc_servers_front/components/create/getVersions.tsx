

export const getVersions = async (snapshots?: boolean) => {
    try {
        const response = await fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json')

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        var versionsTmp: React.ReactElement[] = [];

        if (snapshots) {
            data.versions.forEach((element: { type: string; id: string; }) => {
                versionsTmp.push(
                    <option key={element.id} value={element.id}>{element.id}</option>
                );
            });
        }
        else {
            data.versions.forEach((element: { type: string; id: string; }) => {
                if (element.type === 'release') {
                    versionsTmp.push(
                        <option key={element.id} value={element.id}>{element.id}</option>
                    );
                }
            });
        }
        return versionsTmp;
    }
    catch (error) {
        return [];
    }
}
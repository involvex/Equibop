/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Forms, React } from "@equicord/types/webpack/common";
import { useSettings } from "renderer/settings";

import { VesktopSettingsSwitch } from "./VesktopSettingsSwitch";

interface EquicordPlugin {
    name: string;
    description: string;
    authors: Array<{ name: string; id: string }>;
    version: string;
    enabled: boolean;
    dependencies?: string[];
}

export default function EquicordPlugins() {
    const [plugins, setPlugins] = React.useState<EquicordPlugin[]>([]);
    const [loading, setLoading] = React.useState(true);
    const settings = useSettings();

    React.useEffect(() => {
        loadPlugins();
    }, []);

    async function loadPlugins() {
        try {
            const pluginList = await VesktopNative.equicord.getAllPlugins();
            setPlugins(pluginList);
        } catch (error) {
            console.error("Failed to load Equicord plugins:", error);
        } finally {
            setLoading(false);
        }
    }

    async function togglePlugin(pluginName: string, currentState: boolean) {
        try {
            if (currentState) {
                await VesktopNative.equicord.disablePlugin(pluginName);
            } else {
                await VesktopNative.equicord.enablePlugin(pluginName);
            }

            setPlugins(prev =>
                prev.map(plugin => (plugin.name === pluginName ? { ...plugin, enabled: !currentState } : plugin))
            );
        } catch (error) {
            console.error(`Failed to toggle plugin ${pluginName}:`, error);
        }
    }

    if (loading) {
        return <Forms.FormText>Loading Equicord plugins...</Forms.FormText>;
    }

    if (plugins.length === 0) {
        return (
            <>
                <Forms.FormTitle tag="h3">Equicord Plugins</Forms.FormTitle>
                <Forms.FormText>No Equicord plugins found.</Forms.FormText>
            </>
        );
    }

    return (
        <>
            <Forms.FormTitle tag="h3">Equicord Plugins</Forms.FormTitle>
            <Forms.FormText>
                Manage your Equicord plugins. Plugins can enhance your Discord experience with additional features.
            </Forms.FormText>

            {plugins.map(plugin => (
                <VesktopSettingsSwitch
                    key={plugin.name}
                    value={plugin.enabled}
                    onChange={() => togglePlugin(plugin.name, plugin.enabled)}
                    title={plugin.name}
                    description={
                        <>
                            {plugin.description}
                            <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
                                v{plugin.version}
                                {plugin.authors && plugin.authors.length > 0 && (
                                    <> • By {plugin.authors.map(a => a.name).join(", ")}</>
                                )}
                            </div>
                        </>
                    }
                />
            ))}
        </>
    );
}

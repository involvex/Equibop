/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

import { VENCORD_DIR } from "./vencordDir";

export interface EquicordPlugin {
    name: string;
    description: string;
    authors: Array<{ name: string; id: string }>;
    version: string;
    enabled: boolean;
    dependencies?: string[];
    patches?: Array<{
        find: string;
        replacement: {
            match: string;
            replace: string;
        };
    }>;
}

export interface EquicordPluginManifest {
    name: string;
    description: string;
    version: string;
    authors: Array<{ name: string; id: string }>;
    dependencies?: string[];
}

export class EquicordPluginManager {
    private plugins = new Map<string, EquicordPlugin>();
    private pluginDir: string;

    constructor() {
        this.pluginDir = join(VENCORD_DIR, "plugins");
    }

    async initialize(): Promise<void> {
        if (!existsSync(this.pluginDir)) {
            console.log("Equicord plugins directory not found, skipping plugin loading");
            return;
        }

        await this.loadPlugins();
    }

    private async loadPlugins(): Promise<void> {
        try {
            const pluginFolders = readdirSync(this.pluginDir);

            for (const folder of pluginFolders) {
                try {
                    await this.loadPlugin(folder);
                } catch (error) {
                    console.error(`Failed to load plugin ${folder}:`, error);
                }
            }

            console.log(`Loaded ${this.plugins.size} Equicord plugins`);
        } catch (error) {
            console.error("Failed to load Equicord plugins:", error);
        }
    }

    private async loadPlugin(pluginName: string): Promise<void> {
        const pluginPath = join(this.pluginDir, pluginName);
        const manifestPath = join(pluginPath, "manifest.json");

        if (!existsSync(manifestPath)) {
            console.warn(`Plugin ${pluginName} missing manifest.json`);
            return;
        }

        try {
            const manifestContent = readFileSync(manifestPath, "utf-8");
            const manifest: EquicordPluginManifest = JSON.parse(manifestContent);

            const plugin: EquicordPlugin = {
                name: manifest.name,
                description: manifest.description,
                authors: manifest.authors,
                version: manifest.version,
                enabled: false,
                dependencies: manifest.dependencies
            };

            this.plugins.set(pluginName, plugin);
        } catch (error) {
            console.error(`Failed to parse manifest for ${pluginName}:`, error);
        }
    }

    getPlugin(name: string): EquicordPlugin | undefined {
        return this.plugins.get(name);
    }

    getAllPlugins(): EquicordPlugin[] {
        return Array.from(this.plugins.values());
    }

    enablePlugin(name: string): boolean {
        const plugin = this.plugins.get(name);
        if (!plugin) return false;

        plugin.enabled = true;
        return true;
    }

    disablePlugin(name: string): boolean {
        const plugin = this.plugins.get(name);
        if (!plugin) return false;

        plugin.enabled = false;
        return true;
    }

    isPluginEnabled(name: string): boolean {
        return this.plugins.get(name)?.enabled ?? false;
    }
}

export const equicordPluginManager = new EquicordPluginManager();

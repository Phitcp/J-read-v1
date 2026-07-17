"use client";

import { useState } from "react";
import { useProviderConfig } from "@/shared/hooks/useProviderConfig";
import { useApiKeyManager } from "@/shared/hooks/useApiKeyManager";
import SettingsPanel from "@/shared/components/SettingsPanel";
import Sidebar, { TabId } from "@/shared/components/Sidebar";
import TranslationTab from "@/features/translation/TranslationTab";
import WritingTab from "@/features/writing/WritingTab";
import GrammarTab from "@/features/grammar/GrammarTab";
import ApiKeyManagerPanel from "@/features/api-key-manager/components/ApiKeyManagerPanel";

export default function Home() {
  const { selection, updateSelection } = useProviderConfig();
  const keyManager = useApiKeyManager();
  const [activeTab, setActiveTab] = useState<TabId>("translation");

  return (
    <div className="flex flex-1">
      <Sidebar active={activeTab} onChange={setActiveTab} />

      <main className="flex flex-col flex-1 px-8 py-8 gap-6 max-w-4xl">
        <SettingsPanel
          selection={selection}
          onChange={updateSelection}
          keyManager={keyManager}
          onGoToKeys={() => setActiveTab("keys")}
        />

        {activeTab === "translation" && (
          <TranslationTab selection={selection} keyManager={keyManager} />
        )}
        {activeTab === "writing" && <WritingTab selection={selection} keyManager={keyManager} />}
        {activeTab === "grammar" && <GrammarTab selection={selection} keyManager={keyManager} />}
        {activeTab === "keys" && (
          <ApiKeyManagerPanel selection={selection} keyManager={keyManager} />
        )}
      </main>
    </div>
  );
}

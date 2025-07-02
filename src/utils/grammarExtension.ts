/**
 * @fileoverview
 * TipTap extension for inline grammar suggestions with Grammarly-style underlines
 */

import { Mark } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export interface GrammarSuggestion {
  from: number;
  to: number;
  replacement: string;
  message: string;
  type: 'spelling' | 'grammar' | 'style';
}

/**
 * @description TipTap extension for inline grammar suggestions
 */
export const GrammarSuggestions = Mark.create({
  name: 'grammarSuggestion',

  addOptions() {
    return {
      suggestions: [] as GrammarSuggestion[],
      onApplySuggestion: (suggestion: GrammarSuggestion) => {},
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;
    
    return [
      new Plugin({
        key: new PluginKey('grammarSuggestions'),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, decorationSet, oldState, newState) {
            // Update decorations based on suggestions
            const decorations: Decoration[] = [];
            
            options.suggestions.forEach((suggestion: GrammarSuggestion) => {
              const decoration = Decoration.inline(
                suggestion.from,
                suggestion.to,
                {
                  class: `grammar-suggestion grammar-suggestion-${suggestion.type}`,
                  'data-suggestion': JSON.stringify(suggestion),
                },
                {
                  inclusiveStart: false,
                  inclusiveEnd: false,
                }
              );
              decorations.push(decoration);
            });

            return DecorationSet.create(newState.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleClick(view, pos, event) {
            const target = event.target as HTMLElement;
            if (target.classList.contains('grammar-suggestion')) {
              const suggestionData = target.getAttribute('data-suggestion');
              if (suggestionData) {
                const suggestion = JSON.parse(suggestionData) as GrammarSuggestion;
                
                // Show tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'grammar-tooltip';
                tooltip.innerHTML = `
                  <div class="grammar-tooltip-content">
                    <p class="grammar-tooltip-message">${suggestion.message}</p>
                    <p class="grammar-tooltip-replacement">
                      <span class="grammar-tooltip-label">Suggestion:</span>
                      <strong>${suggestion.replacement}</strong>
                    </p>
                    <p class="grammar-tooltip-hint">Press space to apply</p>
                  </div>
                `;
                
                // Position tooltip
                const rect = target.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.bottom + 5}px`;
                tooltip.style.zIndex = '1000';
                
                document.body.appendChild(tooltip);
                
                // Store current suggestion for space key handler
                (window as any).__currentGrammarSuggestion = suggestion;
                
                // Remove tooltip on click outside
                const removeTooltip = () => {
                  tooltip.remove();
                  delete (window as any).__currentGrammarSuggestion;
                  document.removeEventListener('click', removeTooltip);
                };
                
                setTimeout(() => {
                  document.addEventListener('click', removeTooltip);
                }, 0);
                
                return true;
              }
            }
            return false;
          },
          handleKeyDown(view, event) {
            // Apply suggestion on space key
            if (event.key === ' ' && (window as any).__currentGrammarSuggestion) {
              event.preventDefault();
              const suggestion = (window as any).__currentGrammarSuggestion as GrammarSuggestion;
              
              // Apply the suggestion
              const tr = view.state.tr.replaceRangeWith(
                suggestion.from,
                suggestion.to,
                view.state.schema.text(suggestion.replacement)
              );
              view.dispatch(tr);
              
              // Call callback
              options.onApplySuggestion(suggestion);
              
              // Clean up
              delete (window as any).__currentGrammarSuggestion;
              
              // Remove any tooltips
              document.querySelectorAll('.grammar-tooltip').forEach(el => el.remove());
              
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});

/**
 * @description Update grammar suggestions in the editor
 * @param {any} editor - TipTap editor instance
 * @param {GrammarSuggestion[]} suggestions - Array of grammar suggestions
 */
export function updateGrammarSuggestions(editor: any, suggestions: GrammarSuggestion[]) {
  // Update the extension options
  const grammarExt = editor.extensionManager.extensions
    .find((ext: any) => ext.name === 'grammarSuggestion');
  
  if (grammarExt) {
    grammarExt.options.suggestions = suggestions;
  }
  
  // Force re-render of decorations
  editor.view.dispatch(editor.state.tr);
} 
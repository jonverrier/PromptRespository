/**
 * Test module for evaluating prompt responses.
 * Contains integration tests that verify prompts produce consistent and appropriate 
 * responses when processed by the LLM. 
 * Tests cover three cases: 
 * 1) Simple input/output with known content, 
 * 2) Similar input that should produce same output, and 
 * 3) Variant input that should produce different output.
 */

// Copyright (c) 2025 Jon Verrier
import { expect } from 'expect';
import { describe, it } from 'mocha';
import { IPrompt, IPromptRepository } from '../src/entry';
import prompts from './template-prompt.json';
import { getModelResponse } from '../src/Chat';
import { PromptInMemoryRepository } from '../src/PromptRepository';

describe('Motor Racing Welcome Prompt Tests', () => {

   const TEST_TIMEOUT = 10000; // 10 seconds
   let prompt: IPrompt = prompts.find(p => p.id === "template-prompt-002")!;
   const promptRepo : IPromptRepository= new PromptInMemoryRepository([prompt]);

    it('should generate appropriate welcome message for Monaco', async () => {
        const prompt = promptRepo.getPrompt('template-prompt-002');
        expect(prompt).toBeDefined();
        
        const systemPrompt = promptRepo.expandSystemPrompt(prompt!, {});
        const userPrompt = promptRepo.expandUserPrompt(prompt!, { LOCATION: 'Monaco' });
        
        const response = await getModelResponse(systemPrompt, userPrompt);
        
        // The response should contain 'Monaco' but not duplicate these words
        expect(response).toContain('Monaco');
        expect(response.toLowerCase()).toMatch(/welcome|greetings/);
        expect(response.split('Monaco').length).toBe(2); // Only one occurrence
        
    }).timeout(TEST_TIMEOUT);

    it('should generate same welcome pattern for Monaco Monaco', async () => {
      const prompt = promptRepo.getPrompt('template-prompt-002');
      expect(prompt).toBeDefined();
      
      const systemPrompt = promptRepo.expandSystemPrompt(prompt!, {});
      const userPrompt = promptRepo.expandUserPrompt(prompt!, { LOCATION: 'Monaco Monaco' });
      
      const response = await getModelResponse(systemPrompt, userPrompt);
      
      // Should follow same pattern as Monaco test since Monte Carlo is the same location
      expect(response).toContain('Monaco');
      expect(response.toLowerCase()).toMatch(/welcome|greetings/);
      expect(response.split('Monaco').length).toBe(2); // Only one occurrence
      
  }).timeout(TEST_TIMEOUT);

    it('should generate same welcome pattern for Monaco Grand Prix', async () => {
        const prompt = promptRepo.getPrompt('template-prompt-002');
        expect(prompt).toBeDefined();
        
        const systemPrompt = promptRepo.expandSystemPrompt(prompt!, {});
        const userPrompt = promptRepo.expandUserPrompt(prompt!, { LOCATION: 'Monaco Grand Prix' });
        
        const response = await getModelResponse(systemPrompt, userPrompt);
        
        // Should follow same pattern as Monaco test since Monte Carlo is the same location
        expect(response).toContain('Monaco');
        expect(response.toLowerCase()).toMatch(/welcome|greetings/);
        expect(response.split('Grand Prix').length).toBe(2); // Only one occurrence
        
    }).timeout(TEST_TIMEOUT);

    it('should generate different welcome message for Silverstone', async () => {

        const prompt = promptRepo.getPrompt('template-prompt-002');
        expect(prompt).toBeDefined();
        
        const systemPrompt = promptRepo.expandSystemPrompt(prompt!, {});
        const userPrompt = promptRepo.expandUserPrompt(prompt!, { LOCATION: 'Silverstone' });
        
        const response = await getModelResponse(systemPrompt, userPrompt);
        
        // Should contain Silverstone-specific content
        expect(response).toContain('Silverstone');
        expect(response.toLowerCase()).toMatch(/welcome|greetings/);
        expect(response.split('Silverstone').length).toBe(2); // Only one occurrence
        // Verify it's different from Monaco/Monte Carlo responses
        expect(response).not.toContain('Monaco');
        expect(response).not.toContain('Monte Carlo');

    }).timeout(TEST_TIMEOUT);
});

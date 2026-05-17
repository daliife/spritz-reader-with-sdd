import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SpeedReader } from './SpeedReader'
import type { Translations } from '../../i18n/translations'

const mockT: Translations = {
  idlePlaceholder: 'Press play to start reading',
  finishedMessage: 'Finished — press restart to read again',
  play: '▶ Play',
  pause: '⏸ Pause',
  restart: '↺ Restart',
  wordOf: (c, t) => `Word ${c} of ${t}`,
  changeText: 'Change text ↓',
  hideTextPanel: 'Hide text panel ↑',
  textareaPlaceholder: 'Paste your own text here…',
  useDemoText: 'Use demo text',
  switchToLight: 'Switch to light mode',
  switchToDark: 'Switch to dark mode',
  keyboardHint: 'Space · R · ← / →',
}

describe('SpeedReader', () => {
  it('shows placeholder text in idle state', () => {
    render(<SpeedReader word="" status="idle" t={mockT} />)
    expect(screen.getByText(/press play to start/i)).toBeInTheDocument()
  })

  it('shows completion message in finished state', () => {
    render(<SpeedReader word="done" status="finished" t={mockT} />)
    expect(screen.getByText(/finished/i)).toBeInTheDocument()
  })

  it('renders the word when playing', () => {
    render(<SpeedReader word="Your" status="playing" t={mockT} />)
    // "Your" → left='Y', pivot='o', right='ur'
    expect(screen.getByText('Y')).toBeInTheDocument()
    expect(screen.getByText('o')).toBeInTheDocument()
    expect(screen.getByText('ur')).toBeInTheDocument()
  })

  it('renders the word when paused', () => {
    render(<SpeedReader word="reading" status="paused" t={mockT} />)
    // "reading" → left='re', pivot='a', right='ding'
    expect(screen.getByText('re')).toBeInTheDocument()
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('ding')).toBeInTheDocument()
  })

  it('has the aria-label set to the current word', () => {
    render(<SpeedReader word="hello" status="playing" t={mockT} />)
    expect(screen.getByLabelText('hello')).toBeInTheDocument()
  })
})

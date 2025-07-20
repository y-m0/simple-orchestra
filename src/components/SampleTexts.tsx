const sampleTexts = [
  {
    id: 'sample1',
    title: 'Artificial Intelligence',
    text: `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.`
  },
  {
    id: 'sample2',
    title: 'Climate Change',
    text: `Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, such as through variations in the solar cycle. But since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas. Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. Examples of greenhouse gas emissions that are causing climate change include carbon dioxide and methane.`
  },
  {
    id: 'sample3',
    title: 'Quantum Computing',
    text: `Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations. The devices that perform quantum computations are known as quantum computers. Though current quantum computers are too small to outperform usual (classical) computers for practical applications, they are believed to be capable of solving certain computational problems, such as integer factorization (which underlies RSA encryption), substantially faster than classical computers.`
  }
]

interface SampleTextsProps {
  onSelectSample: (text: string) => void
}

const SampleTexts = ({ onSelectSample }: SampleTextsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-3">Try with sample texts:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sampleTexts.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelectSample(sample.text)}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
          >
            <h4 className="font-medium mb-1">{sample.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {sample.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SampleTexts
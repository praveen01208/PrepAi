import json
import os
import sys
from fpdf import FPDF

def sanitize_text(text: str) -> str:
    if not text:
        return ""
    replacements = {
        "“": '"', "”": '"', "‘": "'", "’": "'",
        "—": "--", "–": "-", "…": "...", "•": "-",
        "→": "->", "←": "<-", "⇒": "=>", "≤": "<=",
        "≥": ">=", "≠": "!=", "≈": "~", "×": "*",
        "²": "^2", "³": "^3", "°": " deg", "µ": "u",
        "∈": " in ", "∉": " not in ", "∅": "empty",
        "∞": "infinity", "∑": "sum", "√": "sqrt",
        "≤": "<=", "≥": ">=", "±": "+/-"
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text.encode("latin-1", "replace").decode("latin-1")

SOLUTIONS_DATA = {
    1: {
        "approach": "Hash Map (One-Pass)",
        "intuition": "Iterate through nums while storing each number and its index in a hash map. For each num, calculate complement = target - num. If complement exists in map, return [map[complement], current_index].",
        "time": "O(N) - Single pass through the array with O(1) average lookup.",
        "space": "O(N) - Hash map stores up to N elements.",
        "edgeCases": "Negative numbers, duplicates, solution at the first and last element.",
        "code": """def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []"""
    },
    2: {
        "approach": "Hash Set",
        "intuition": "Traverse the array and insert each element into a hash set. If an element is already in the set, a duplicate exists; return True. If loop finishes, return False.",
        "time": "O(N) - Single pass through the array.",
        "space": "O(N) - Set stores at most N elements.",
        "edgeCases": "Array with 1 element (always False), all identical elements, all distinct.",
        "code": """def containsDuplicate(nums: list[int]) -> bool:
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False"""
    },
    3: {
        "approach": "Character Frequency Counting",
        "intuition": "If string lengths differ, they cannot be anagrams. Count character frequencies using a fixed-size 26-element array or counter. Verify both strings have identical character frequencies.",
        "time": "O(N) - Where N is length of strings.",
        "space": "O(1) - Fixed alphabet size (26 lowercase English letters).",
        "edgeCases": "Strings of unequal length, single character strings, identical strings.",
        "code": """def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for c1, c2 in zip(s, t):
        count[ord(c1) - ord('a')] += 1
        count[ord(c2) - ord('a')] -= 1
    return all(c == 0 for c in count)"""
    },
    4: {
        "approach": "Hash Map with Sorted Key / Frequency Tuple",
        "intuition": "Anagrams have identical sorted character sequences. Use the sorted string (or character count tuple) as a dictionary key and append matching strings to list values.",
        "time": "O(N * K log K) - N strings of max length K sorted.",
        "space": "O(N * K) - Storing all strings in hash map values.",
        "edgeCases": "Empty strings, single char strings, all words having no anagrams.",
        "code": """from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())"""
    },
    5: {
        "approach": "Min-Heap / Bucket Sort",
        "intuition": "Count frequencies with Counter. Use a bucket sort array where index is frequency (0 to N), and values are lists of numbers with that frequency. Collect top k from right to left.",
        "time": "O(N) - Linear time using bucket sort.",
        "space": "O(N) - Storing frequency count and bucket list.",
        "edgeCases": "k equals array length, all elements have equal frequency, negative numbers.",
        "code": """from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        buckets[freq].append(num)
    res = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res
    return res"""
    },
    6: {
        "approach": "Prefix and Suffix Products (Without Division)",
        "intuition": "Build output array using prefix product from left to right. Then do a second pass from right to left accumulating suffix product, multiplying it into the prefix value.",
        "time": "O(N) - Two linear passes.",
        "space": "O(1) - Output array does not count towards auxiliary space.",
        "edgeCases": "Array contains one zero, multiple zeros, negative numbers.",
        "code": """def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    postfix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]
    return res"""
    },
    7: {
        "approach": "Hash Set & Sequence Start Detection",
        "intuition": "Insert all numbers into a set. A number is the start of a consecutive sequence only if (num - 1) is not in the set. For every sequence start, count forward (num + 1, num + 2...).",
        "time": "O(N) - Each number visited at most twice.",
        "space": "O(N) - Hash set for O(1) lookups.",
        "edgeCases": "Empty array, duplicate values, large numbers with integer gaps.",
        "code": """def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)
    longest = 0
    for n in num_set:
        if (n - 1) not in num_set:
            current_num = n
            streak = 1
            while (current_num + 1) in num_set:
                current_num += 1
                streak += 1
            longest = max(longest, streak)
    return longest"""
    },
    8: {
        "approach": "Two Pointers (Left and Right)",
        "intuition": "Place pointers at start and end. Advance left and decrement right while skipping non-alphanumeric characters. Compare lowercased characters; return False on mismatch.",
        "time": "O(N) - Single pass with two pointers.",
        "space": "O(1) - Constant auxiliary space in-place.",
        "edgeCases": "Empty string or only spaces/punctuation (returns True), single character.",
        "code": """def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True"""
    },
    9: {
        "approach": "Two Pointers on 1-Indexed Sorted Array",
        "intuition": "Because array is sorted: if numbers[l] + numbers[r] > target, decrease r. If sum < target, increase l. Return 1-indexed [l + 1, r + 1] when sum equals target.",
        "time": "O(N) - Each element checked at most once.",
        "space": "O(1) - In-place pointer traversal.",
        "edgeCases": "Two elements only, negative target, large numbers.",
        "code": """def twoSum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1
    while l < r:
        curr_sum = numbers[l] + numbers[r]
        if curr_sum == target:
            return [l + 1, r + 1]
        elif curr_sum > target:
            r -= 1
        else:
            l += 1
    return []"""
    },
    10: {
        "approach": "Sort Array + Two Pointers (Avoid Duplicates)",
        "intuition": "Sort nums. For each index i, if nums[i] == nums[i-1], skip to prevent duplicate triplets. Use two pointers on subarray (i+1 to end) to find pairs summing to -nums[i].",
        "time": "O(N^2) - Sorting takes O(N log N) plus N * two-pointer passes.",
        "space": "O(1) or O(N) - Dependent on sorting implementation.",
        "edgeCases": "All zeros ([0,0,0] -> [[0,0,0]]), duplicate numbers, no triplet possible.",
        "code": """def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1; r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
    return res"""
    },
    11: {
        "approach": "Two Pointers Greedy",
        "intuition": "Start pointers at both ends. Area is (r - l) * min(h[l], h[r]). The bottleneck is always the shorter line. Move the shorter line inward to potentially find a taller boundary.",
        "time": "O(N) - Pointers meet after at most N steps.",
        "space": "O(1) - Constant space.",
        "edgeCases": "Two bars only, all bars same height, strictly increasing/decreasing heights.",
        "code": """def maxArea(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_w = 0
    while l < r:
        area = (r - l) * min(height[l], height[r])
        max_w = max(max_w, area)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_w"""
    },
    12: {
        "approach": "Two Pointers with Left & Right Max Tracking",
        "intuition": "Maintain left_max and right_max. At any index, water trapped is determined by min(left_max, right_max) - height. Advance the pointer with smaller max height.",
        "time": "O(N) - Single pass through heights.",
        "space": "O(1) - Constant variables for tracking max heights.",
        "edgeCases": "Fewer than 3 elements (0 trapped), strictly descending/ascending terrain.",
        "code": """def trap(height: list[int]) -> int:
    if not height: return 0
    l, r = 0, len(height) - 1
    l_max, r_max = height[l], height[r]
    water = 0
    while l < r:
        if l_max < r_max:
            l += 1
            l_max = max(l_max, height[l])
            water += l_max - height[l]
        else:
            r -= 1
            r_max = max(r_max, height[r])
            water += r_max - height[r]
    return water"""
    },
    13: {
        "approach": "One-Pass Running Minimum Price",
        "intuition": "Track the lowest stock price seen so far. At each day, calculate profit if sold today: price - min_price. Update max_profit accordingly.",
        "time": "O(N) - Single pass.",
        "space": "O(1) - Two variables min_price and max_profit.",
        "edgeCases": "Prices strictly decrease (profit 0), price stays flat, 1 day only.",
        "code": """def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_profit:
            max_profit = p - min_price
    return max_profit"""
    },
    14: {
        "approach": "Sliding Window with Hash Map / Set",
        "intuition": "Keep a sliding window [l, r]. If character at r is already in window, increment l until character is removed. Window size is r - l + 1.",
        "time": "O(N) - Each character added and removed at most once.",
        "space": "O(min(N, M)) - Where M is alphabet size.",
        "edgeCases": "Empty string (0), string with all identical chars ('bbbbb' -> 1).",
        "code": """def lengthOfLongestSubstring(s: str) -> int:
    seen = {}
    l = 0
    max_len = 0
    for r, char in enumerate(s):
        if char in seen and seen[char] >= l:
            l = seen[char] + 1
        seen[char] = r
        max_len = max(max_len, r - l + 1)
    return max_len"""
    },
    15: {
        "approach": "Sliding Window Tracking Max Frequency",
        "intuition": "Window is valid if (window_length - max_char_frequency) <= k. If invalid, increment left pointer by 1. The max window length ever reached is the answer.",
        "time": "O(N) - Linear pass.",
        "space": "O(1) - Max 26 uppercase alphabet counter.",
        "edgeCases": "k exceeds string length, all characters already same, k = 0.",
        "code": """from collections import defaultdict

def characterReplacement(s: str, k: int) -> int:
    count = defaultdict(int)
    max_f = 0
    l = 0
    for r in range(len(s)):
        count[s[r]] += 1
        max_f = max(max_f, count[s[r]])
        if (r - l + 1) - max_f > k:
            count[s[l]] -= 1
            l += 1
    return len(s) - l"""
    },
    16: {
        "approach": "Sliding Window with Target Frequency Counter",
        "intuition": "Expand right pointer until all characters from t are satisfied (formed == required). Then contract left pointer to minimize window while maintaining valid window condition.",
        "time": "O(|S| + |T|) - Linear scan of both strings.",
        "space": "O(|S| + |T|) - Frequency tables for window and target.",
        "edgeCases": "len(s) < len(t), no valid substring exists, s == t.",
        "code": """from collections import Counter

def minWindow(s: str, t: str) -> str:
    if not t or not s or len(s) < len(t): return ""
    target_cnt = Counter(t)
    required = len(target_cnt)
    window_cnt = {}
    l, formed = 0, 0
    ans = float("inf"), None, None
    for r, ch in enumerate(s):
        window_cnt[ch] = window_cnt.get(ch, 0) + 1
        if ch in target_cnt and window_cnt[ch] == target_cnt[ch]:
            formed += 1
        while l <= r and formed == required:
            if (r - l + 1) < ans[0]:
                ans = (r - l + 1, l, r)
            window_cnt[s[l]] -= 1
            if s[l] in target_cnt and window_cnt[s[l]] < target_cnt[s[l]]:
                formed -= 1
            l += 1
    return "" if ans[0] == float("inf") else s[ans[1]:ans[2] + 1]"""
    },
    17: {
        "approach": "Stack Matching",
        "intuition": "Push opening brackets onto stack. For closing brackets, check if stack is empty or top does not match corresponding opening bracket. Stack must be empty at the end.",
        "time": "O(N) - Push and pop each character once.",
        "space": "O(N) - Stack size in worst case (e.g. '((((((').",
        "edgeCases": "Odd length string, closing bracket first, unclosed brackets.",
        "code": """def isValid(s: str) -> bool:
    pairs = {')': '(', '}': '{', ']': '['}
    stack = []
    for c in s:
        if c in pairs:
            if not stack or stack[-1] != pairs[c]:
                return False
            stack.pop()
        else:
            stack.append(c)
    return len(stack) == 0"""
    },
    18: {
        "approach": "Dual Stack (Value Stack + Min Stack)",
        "intuition": "Maintain main stack for values and auxiliary min_stack. When pushing x, push min(x, min_stack[-1]) to min_stack. getMin() simply returns min_stack[-1].",
        "time": "O(1) - For all operations (push, pop, top, getMin).",
        "space": "O(N) - Auxiliary min stack.",
        "edgeCases": "Multiple duplicate minimums, popping the minimum element.",
        "code": """class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]"""
    },
    19: {
        "approach": "Monotonic Decreasing Stack",
        "intuition": "Keep a stack of indices with decreasing temperatures. When current temperature > stack[-1], pop index and calculate days = current_index - prev_index.",
        "time": "O(N) - Each index pushed and popped at most once.",
        "space": "O(N) - Stack storing indices.",
        "edgeCases": "Temperatures strictly decrease (all zeros in result), all equal temps.",
        "code": """def dailyTemperatures(temperatures: list[int]) -> list[int]:
    res = [0] * len(temperatures)
    stack = []  # indices
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            prev = stack.pop()
            res[prev] = i - prev
        stack.append(i)
    return res"""
    },
    20: {
        "approach": "Monotonic Stack with Dummy Zero Boundaries",
        "intuition": "Maintain a stack of bar indices in ascending height order. When a shorter bar is encountered, pop previous bars; the popped bar is the shortest in the rectangle extending between current index and new stack top.",
        "time": "O(N) - Each bar pushed and popped once.",
        "space": "O(N) - Stack.",
        "edgeCases": "Single bar, all bars same height, strictly ascending heights.",
        "code": """def largestRectangleArea(heights: list[int]) -> int:
    stack = []
    max_area = 0
    heights.append(0)
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    heights.pop()
    return max_area"""
    },
    21: {
        "approach": "Standard Binary Search",
        "intuition": "Set l = 0, r = len(nums) - 1. Calculate mid = l + (r - l) // 2. If nums[mid] == target, return mid; if nums[mid] < target, l = mid + 1; else r = mid - 1.",
        "time": "O(log N) - Search space halved every step.",
        "space": "O(1) - Constant variables.",
        "edgeCases": "Target smaller than all elements, target larger, single element array.",
        "code": """def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1"""
    },
    22: {
        "approach": "Treat 2D Matrix as 1D Virtual Array",
        "intuition": "Total elements = m * n. Binary search with indices 0 to m*n - 1. Convert index mid to matrix coordinates: row = mid // n, col = mid % n.",
        "time": "O(log(m * n)) - Standard binary search on virtual 1D array.",
        "space": "O(1) - In-place index calculations.",
        "edgeCases": "1x1 matrix, target not in range, target is first/last element.",
        "code": """def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]: return False
    m, n = len(matrix), len(matrix[0])
    l, r = 0, m * n - 1
    while l <= r:
        mid = l + (r - l) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            l = mid + 1
        else:
            r = mid - 1
    return False"""
    },
    23: {
        "approach": "Modified Binary Search (Check Sorted Half)",
        "intuition": "At least one half [l, mid] or [mid, r] is always sorted. Check if target lies within the sorted half; if yes, narrow search to that half, otherwise search the other half.",
        "time": "O(log N) - Logarithmic search space reduction.",
        "space": "O(1) - Constant space.",
        "edgeCases": "Array rotated at 0 (unrotated), target not present, 1 or 2 elements.",
        "code": """def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if nums[mid] == target:
            return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1"""
    },
    24: {
        "approach": "Binary Search on Partition of Smaller Array",
        "intuition": "Partition both arrays such that left halves contain half the elements and max(left) <= min(right). Binary search partition position in the smaller array.",
        "time": "O(log(min(M, N))) - Binary search on smaller array.",
        "space": "O(1) - Constant pointer variables.",
        "edgeCases": "One array empty, odd vs even total length, non-overlapping arrays.",
        "code": """def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    A, B = nums1, nums2
    if len(B) < len(A):
        A, B = B, A
    total = len(A) + len(B)
    half = total // 2
    l, r = 0, len(A) - 1
    while True:
        i = (l + r) // 2
        j = half - i - 2
        Aleft = A[i] if i >= 0 else float("-inf")
        Aright = A[i + 1] if (i + 1) < len(A) else float("inf")
        Bleft = B[j] if j >= 0 else float("-inf")
        Bright = B[j + 1] if (j + 1) < len(B) else float("inf")
        if Aleft <= Bright and Bleft <= Aright:
            if total % 2:
                return min(Aright, Bright)
            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2
        elif Aleft > Bright:
            r = i - 1
        else:
            l = i + 1"""
    },
    25: {
        "approach": "Iterative Three-Pointers (prev, curr, nxt)",
        "intuition": "Initialize prev = None. Traverse list with curr: save nxt = curr.next, reverse link curr.next = prev, move prev = curr and curr = nxt. Return prev.",
        "time": "O(N) - Traverses each node once.",
        "space": "O(1) - Constant pointer manipulation.",
        "edgeCases": "Empty list (None), single node, two node list.",
        "code": """def reverseList(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev"""
    },
    26: {
        "approach": "Dummy Head Pointer Merging",
        "intuition": "Create a dummy head node. Compare values of list1 and list2, appending smaller node to current pointer. Attach remaining non-empty list at the end.",
        "time": "O(N + M) - Traverses both lists.",
        "space": "O(1) - Splices existing nodes in place.",
        "edgeCases": "One or both lists empty, lists of unequal lengths.",
        "code": """def mergeTwoLists(list1, list2):
    dummy = ListNode()
    tail = dummy
    while list1 and list2:
        if list1.val < list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    tail.next = list1 or list2
    return dummy.next"""
    },
    27: {
        "approach": "Floyd's Tortoise and Hare (Slow & Fast Pointers)",
        "intuition": "Move slow by 1 step and fast by 2 steps. If there is a cycle, fast will eventually lap and meet slow. If fast reaches None, no cycle exists.",
        "time": "O(N) - Linear time.",
        "space": "O(1) - Two pointer variables.",
        "edgeCases": "Empty list, single node without cycle, single node pointing to itself.",
        "code": """def hasCycle(head) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False"""
    },
    28: {
        "approach": "Two Pointers with Offset N",
        "intuition": "Advance fast pointer n + 1 steps ahead of slow (starting at dummy node). Then move both until fast reaches None. slow.next will be the node to remove.",
        "time": "O(L) - Single pass where L is list length.",
        "space": "O(1) - Dummy node and two pointers.",
        "edgeCases": "Removing head node (n equals length), single node list.",
        "code": """def removeNthFromEnd(head, n: int):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next"""
    },
    29: {
        "approach": "Min-Heap / Priority Queue or Divide & Conquer",
        "intuition": "Push head of each list into a min-heap with (node.val, id(node), node). Pop the minimum, link it to merged list, and push its next node if present.",
        "time": "O(N log k) - Where N is total nodes and k is number of linked lists.",
        "space": "O(k) - Heap stores at most k nodes.",
        "edgeCases": "Empty lists array, lists containing empty nodes [None, None].",
        "code": """import heapq

def mergeKLists(lists):
    dummy = ListNode(0)
    curr = dummy
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next"""
    },
    30: {
        "approach": "Recursive Post-Order Swap",
        "intuition": "If root is None, return None. Swap root.left and root.right, then recursively invert both subtrees.",
        "time": "O(N) - Visits each node once.",
        "space": "O(H) - Recursion stack equal to tree height.",
        "edgeCases": "Empty tree (None), single node, skewed tree.",
        "code": """def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root"""
    },
    31: {
        "approach": "DFS Recursion (1 + max(left, right))",
        "intuition": "Base case: None node has depth 0. Recursive case: max depth is 1 + max(depth(root.left), depth(root.right)).",
        "time": "O(N) - Visits all N nodes.",
        "space": "O(H) - Recursion call stack height.",
        "edgeCases": "Empty tree (0), single root node (1), degenerate tree.",
        "code": """def maxDepth(root) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))"""
    },
    32: {
        "approach": "BFS with Level-by-Level Queue",
        "intuition": "Use a queue initialized with root. At each level, determine queue size, pop all nodes for that level, record their values, and enqueue their children.",
        "time": "O(N) - Each node enqueued and dequeued once.",
        "space": "O(N) - Queue holds up to N/2 leaf nodes in worst case.",
        "edgeCases": "Empty tree ([]), single node, unbalanced tree.",
        "code": """from collections import deque

def levelOrder(root) -> list[list[int]]:
    if not root: return []
    res = []
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res"""
    },
    33: {
        "approach": "DFS with Valid Range Propagation (-inf, +inf)",
        "intuition": "For a node to be a valid BST node, its value must satisfy low < node.val < high. For left child, high becomes node.val. For right child, low becomes node.val.",
        "time": "O(N) - Each node visited once.",
        "space": "O(H) - Call stack height.",
        "edgeCases": "Node value equals integer bounds, duplicate values (invalid BST).",
        "code": """def isValidBST(root) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return (validate(node.left, low, node.val) and 
                validate(node.right, node.val, high))
    return validate(root)"""
    },
    34: {
        "approach": "DFS Max Gain Computation",
        "intuition": "For each node, compute max non-negative branch gain: max(0, dfs(child)). Path passing through current node as highest point is node.val + left_gain + right_gain. Update global max.",
        "time": "O(N) - Visits each node once.",
        "space": "O(H) - Recursion stack.",
        "edgeCases": "All negative node values, path doesn't include root.",
        "code": """def maxPathSum(root) -> int:
    max_sum = float('-inf')
    def get_max_gain(node):
        nonlocal max_sum
        if not node: return 0
        left = max(get_max_gain(node.left), 0)
        right = max(get_max_gain(node.right), 0)
        max_sum = max(max_sum, node.val + left + right)
        return node.val + max(left, right)
    get_max_gain(root)
    return max_sum"""
    },
    35: {
        "approach": "Trie (Prefix Tree) with Nested Hash Maps",
        "intuition": "Each TrieNode has children dictionary and is_end boolean flag. Traverse character by character: create missing children on insert, check existence on search/startsWith.",
        "time": "O(L) - Where L is length of word for insert, search, and startsWith.",
        "space": "O(Total Characters) - Nodes created for unique prefix paths.",
        "edgeCases": "Empty string prefix, searching prefix that is not a word.",
        "code": """class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for c in word:
            if c not in curr.children:
                curr.children[c] = TrieNode()
            curr = curr.children[c]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for c in word:
            if c not in curr.children: return False
            curr = curr.children[c]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for c in prefix:
            if c not in curr.children: return False
            curr = curr.children[c]
        return True"""
    },
    36: {
        "approach": "Min-Heap of Size K or QuickSelect",
        "intuition": "Maintain a min-heap of size k. For each element in nums, push to heap. If heap size exceeds k, pop the smallest element. After all elements, heap top is the kth largest.",
        "time": "O(N log k) - Heap operations on at most k elements.",
        "space": "O(k) - Stores k elements.",
        "edgeCases": "k = 1 (maximum element), k = N (minimum element), duplicates.",
        "code": """import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]"""
    },
    37: {
        "approach": "Two Heaps (Max-Heap for Lower Half, Min-Heap for Upper Half)",
        "intuition": "Store smaller half in max_heap and larger half in min_heap. Balance heaps so sizes differ by at most 1. Median is top of larger heap or average of both tops.",
        "time": "O(log N) - For addNum; O(1) for findMedian.",
        "space": "O(N) - Storing all numbers across two heaps.",
        "edgeCases": "Stream with duplicate values, even vs odd count of elements.",
        "code": """import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (invert values)
        self.large = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        if self.small and self.large and (-self.small[0] > self.large[0]):
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small) + 1:
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        if len(self.large) > len(self.small):
            return self.large[0]
        return (-self.small[0] + self.large[0]) / 2.0"""
    },
    38: {
        "approach": "Backtracking / Cascading",
        "intuition": "At each index i, we have two choices: include nums[i] in subset or exclude it. Explore both paths recursively, adding current subset copy to results.",
        "time": "O(N * 2^N) - 2^N subsets generated, copying takes O(N).",
        "space": "O(N) - Recursion tree depth.",
        "edgeCases": "Empty array (returns [[]]), single element.",
        "code": """def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    subset = []
    def backtrack(i):
        if i >= len(nums):
            res.append(subset.copy())
            return
        subset.append(nums[i])
        backtrack(i + 1)
        subset.pop()
        backtrack(i + 1)
    backtrack(0)
    return res"""
    },
    39: {
        "approach": "Backtracking with Reuse (Branch Pruning)",
        "intuition": "Try adding candidates[i]. If total sum == target, record combination. If sum > target, prune branch. Call backtrack(i) to allow reusing same element.",
        "time": "O(2^(T/M)) - Where T is target and M is min candidate value.",
        "space": "O(T/M) - Maximum recursion stack depth.",
        "edgeCases": "No combination possible, target equals a candidate value.",
        "code": """def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    res = []
    def dfs(i, cur, total):
        if total == target:
            res.append(cur.copy())
            return
        if i >= len(candidates) or total > target:
            return
        cur.append(candidates[i])
        dfs(i, cur, total + candidates[i])
        cur.pop()
        dfs(i + 1, cur, total)
    dfs(0, [], 0)
    return res"""
    },
    40: {
        "approach": "Backtracking with Column & Diagonal Sets",
        "intuition": "Place queen row by row. Track occupied columns, positive diagonals (r + c), and negative diagonals (r - c) in sets to achieve O(1) conflict checking.",
        "time": "O(N!) - Only valid queen placements explored per row.",
        "space": "O(N) - Storage for board state and conflict sets.",
        "edgeCases": "N = 1 (valid), N = 2 and N = 3 (no solution exists).",
        "code": """def solveNQueens(n: int) -> list[list[str]]:
    col, pos_diag, neg_diag = set(), set(), set()
    res = []
    board = [["."] * n for _ in range(n)]
    def backtrack(r):
        if r == n:
            res.append(["".join(row) for row in board])
            return
        for c in range(n):
            if c in col or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
            col.add(c); pos_diag.add(r + c); neg_diag.add(r - c)
            board[r][c] = "Q"
            backtrack(r + 1)
            col.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c)
            board[r][c] = "."
    backtrack(0)
    return res"""
    },
    41: {
        "approach": "BFS / DFS Flood Fill",
        "intuition": "Iterate through each cell. When an unvisited land cell '1' is found, increment island count and perform BFS/DFS to sink all connected land cells by setting them to '0'.",
        "time": "O(M * N) - Each cell visited at most a constant number of times.",
        "space": "O(M * N) - Call stack / queue for full grid island.",
        "edgeCases": "Grid of all water ('0'), grid of all land ('1'), 1x1 grid.",
        "code": """def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count"""
    },
    42: {
        "approach": "Hash Map with DFS / BFS Graph Traversal",
        "intuition": "Use a hash map to map original nodes to their cloned counterparts (old_to_new). If a node is already in the map, return the clone. Otherwise clone node and clone its neighbors recursively.",
        "time": "O(V + E) - Visits every vertex and edge once.",
        "space": "O(V) - Hash map storing all V cloned nodes.",
        "edgeCases": "Empty graph (None), graph with 1 node and no neighbors, cyclical graph.",
        "code": """def cloneGraph(node):
    if not node: return None
    clones = {}
    def dfs(curr):
        if curr in clones:
            return clones[curr]
        copy = Node(curr.val)
        clones[curr] = copy
        for n in curr.neighbors:
            copy.neighbors.append(dfs(n))
        return copy
    return dfs(node)"""
    },
    43: {
        "approach": "Topological Sort (Kahn's In-Degree / DFS Cycle Detection)",
        "intuition": "Build adjacency list and compute in-degrees. Enqueue all courses with in-degree 0. While queue is non-empty, dequeue course, decrement in-degree of prerequisites, and enqueue newly free courses. Valid if count == numCourses.",
        "time": "O(V + E) - Building graph and processing nodes.",
        "space": "O(V + E) - Adjacency list and queue.",
        "edgeCases": "Self-dependency [0,0], disconnected components, cycle of length 2.",
        "code": """from collections import deque

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        indegree[crs] += 1
    q = deque([i for i in range(numCourses) if indegree[i] == 0])
    visited = 0
    while q:
        node = q.popleft()
        visited += 1
        for neighbor in adj[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                q.append(neighbor)
    return visited == numCourses"""
    },
    44: {
        "approach": "Bidirectional BFS / Pattern Wildcard Matching",
        "intuition": "Generate intermediate word patterns (e.g. h*t for hot, hit). Use BFS starting from beginWord to find shortest path to endWord.",
        "time": "O(M^2 * N) - Where M is word length and N is word count.",
        "space": "O(M^2 * N) - Adjacency patterns dictionary.",
        "edgeCases": "endWord not in wordList (returns 0), beginWord equals endWord.",
        "code": """from collections import deque, defaultdict

def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    if endWord not in wordList: return 0
    patterns = defaultdict(list)
    for word in wordList:
        for j in range(len(word)):
            p = word[:j] + "*" + word[j+1:]
            patterns[p].append(word)
    visited = {beginWord}
    q = deque([(beginWord, 1)])
    while q:
        word, length = q.popleft()
        if word == endWord:
            return length
        for j in range(len(word)):
            p = word[:j] + "*" + word[j+1:]
            for neighbor in patterns[p]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    q.append((neighbor, length + 1))
            patterns[p] = []
    return 0"""
    },
    45: {
        "approach": "Fibonacci DP (Bottom-Up Constant Space)",
        "intuition": "To reach step n, one can jump from step n-1 or n-2. Thus dp[n] = dp[n-1] + dp[n-2] with base cases dp[1]=1, dp[2]=2.",
        "time": "O(N) - Linear iteration.",
        "space": "O(1) - Two variables for previous two steps.",
        "edgeCases": "n = 1 (1), n = 2 (2).",
        "code": """def climbStairs(n: int) -> int:
    if n <= 2: return n
    one, two = 1, 2
    for _ in range(3, n + 1):
        one, two = two, one + two
    return two"""
    },
    46: {
        "approach": "Dynamic Programming (Rob or Skip)",
        "intuition": "At house i, max loot is max(loot_without_robbing_current, loot_including_current + loot_two_houses_ago). Maintain two variables rob1 and rob2.",
        "time": "O(N) - Single pass through houses.",
        "space": "O(1) - Constant variables.",
        "edgeCases": "1 house only, 2 houses, zero money houses.",
        "code": """def rob(nums: list[int]) -> int:
    rob1, rob2 = 0, 0
    for n in nums:
        temp = max(n + rob1, rob2)
        rob1 = rob2
        rob2 = temp
    return rob2"""
    },
    47: {
        "approach": "Bottom-Up Dynamic Programming (Unbounded Knapsack)",
        "intuition": "Let dp[a] be minimum coins for amount a. Initialize dp with inf, dp[0] = 0. For each amount from 1 to amount, dp[a] = min(dp[a], 1 + dp[a - coin]).",
        "time": "O(amount * len(coins)) - Double loop.",
        "space": "O(amount) - DP array of size amount + 1.",
        "edgeCases": "amount = 0 (returns 0), impossible amount (returns -1).",
        "code": """def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return dp[amount] if dp[amount] != float('inf') else -1"""
    },
    48: {
        "approach": "Binary Search with Patience Sorting (Piles)",
        "intuition": "Maintain tails array where tails[i] is smallest tail of all increasing subsequences of length i+1. For each x in nums, binary search insertion point into tails.",
        "time": "O(N log N) - Binary search for each of N numbers.",
        "space": "O(N) - Storage for tails array.",
        "edgeCases": "Strictly decreasing array (1), strictly increasing array (N), duplicates.",
        "code": """import bisect

def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)"""
    },
    49: {
        "approach": "2D Dynamic Programming Table",
        "intuition": "If text1[i] == text2[j], dp[i][j] = 1 + dp[i+1][j+1]. Otherwise, dp[i][j] = max(dp[i+1][j], dp[i][j+1]). Compute bottom-up.",
        "time": "O(M * N) - Where M, N are string lengths.",
        "space": "O(min(M, N)) - Space optimized with single row.",
        "edgeCases": "No common characters (0), identical strings, single character strings.",
        "code": """def longestCommonSubsequence(text1: str, text2: str) -> int:
    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]
    for i in range(len(text1) - 1, -1, -1):
        for j in range(len(text2) - 1, -1, -1):
            if text1[i] == text2[j]:
                dp[i][j] = 1 + dp[i + 1][j + 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])
    return dp[0][0]"""
    },
    50: {
        "approach": "2D Dynamic Programming (Insert, Delete, Replace)",
        "intuition": "If word1[i] == word2[j], cost is dp[i+1][j+1]. Else, cost is 1 + min(insert: dp[i][j+1], delete: dp[i+1][j], replace: dp[i+1][j+1]).",
        "time": "O(M * N) - Matrix dimensions.",
        "space": "O(M * N) - 2D DP matrix.",
        "edgeCases": "One string empty (cost = length of other string), identical words.",
        "code": """def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]"""
    },
    51: {
        "approach": "Kadane's Algorithm",
        "intuition": "Track current_sum. At each element, current_sum = max(n, current_sum + n). Update max_sum. Discard negative running sums immediately.",
        "time": "O(N) - Single pass.",
        "space": "O(1) - Two variables.",
        "edgeCases": "All negative numbers (returns largest negative number), single element.",
        "code": """def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]
    curr_sum = 0
    for n in nums:
        curr_sum = max(n, curr_sum + n)
        max_sum = max(max_sum, curr_sum)
    return max_sum"""
    },
    52: {
        "approach": "Greedy (Max Reachable Index)",
        "intuition": "Maintain max_reach = 0. For each index i, if i > max_reach, destination cannot be reached. Update max_reach = max(max_reach, i + nums[i]). If max_reach >= last index, return True.",
        "time": "O(N) - Single pass.",
        "space": "O(1) - Constant space.",
        "edgeCases": "Array with 1 element (always True), zeros blocking further jumps.",
        "code": """def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, n in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + n)
        if max_reach >= len(nums) - 1:
            return True
    return True"""
    },
    53: {
        "approach": "Sort by Start Time and Merge Overlaps",
        "intuition": "Sort intervals by start time. Iterate through intervals: if current interval overlaps with previous (start <= prev.end), merge by setting prev.end = max(prev.end, current.end).",
        "time": "O(N log N) - Sorting intervals.",
        "space": "O(N) - Output list.",
        "edgeCases": "No overlapping intervals, all intervals overlap into one, single interval.",
        "code": """def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged"""
    },
    54: {
        "approach": "Greedy by Earliest End Time",
        "intuition": "Sort intervals by end time. Keep track of previous end time. If next interval starts before previous end time, an overlap occurs (increment count); otherwise update end time.",
        "time": "O(N log N) - Sorting by interval end time.",
        "space": "O(1) - Constant tracking variable.",
        "edgeCases": "No overlapping intervals (0 removed), all mutually overlapping.",
        "code": """def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    count = 0
    prev_end = float('-inf')
    for start, end in intervals:
        if start >= prev_end:
            prev_end = end
        else:
            count += 1
    return count"""
    },
    55: {
        "approach": "Bitwise XOR (a ^ a = 0 and a ^ 0 = a)",
        "intuition": "XORing any number with itself cancels to 0. XORing all numbers in array leaves only the unique number that appears once.",
        "time": "O(N) - Single pass XORing all numbers.",
        "space": "O(1) - Single accumulator variable.",
        "edgeCases": "Single element array, negative numbers.",
        "code": """def singleNumber(nums: list[int]) -> int:
    res = 0
    for n in nums:
        res ^= n
    return res"""
    },
    56: {
        "approach": "Brian Kernighan's Algorithm (n & (n - 1))",
        "intuition": "The operation n & (n - 1) clears the lowest set bit in n. Repeat until n becomes 0; the number of iterations equals the count of 1 bits.",
        "time": "O(K) - Where K is number of set bits (at most 32 for integer).",
        "space": "O(1) - Constant space.",
        "edgeCases": "n = 0 (0 bits), n = 2^31 - 1 (all ones).",
        "code": """def hammingWeight(n: int) -> int:
    count = 0
    while n:
        n &= (n - 1)
        count += 1
    return count"""
    },
    57: {
        "approach": "Dynamic Programming with Bit Shifting (dp[i] = dp[i >> 1] + (i & 1))",
        "intuition": "Count of set bits in i equals bits in (i // 2) plus the least significant bit (i % 2). Compute dp array iteratively from 0 to n.",
        "time": "O(N) - Single linear pass to fill array.",
        "space": "O(N) - Output array of size n + 1.",
        "edgeCases": "n = 0 (returns [0]), powers of 2 (always 1 bit).",
        "code": """def countBits(n: int) -> list[int]:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp"""
    },
    58: {
        "approach": "Bitwise Addition (XOR for Sum, AND with Shift for Carry)",
        "intuition": "a ^ b gives sum without carry. (a & b) << 1 gives the carry bits. Repeat addition with sum and carry until carry is 0 (with 32-bit mask for 2's complement).",
        "time": "O(1) - Maximum 32 bit operations.",
        "space": "O(1) - Constant variables.",
        "edgeCases": "Negative numbers, opposite sign numbers, sum resulting in 0.",
        "code": """def getSum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    while (b & mask) > 0:
        carry = (a & b) << 1
        a = a ^ b
        b = carry
    return (a & mask) if b > 0 else a"""
    }
}

class LeetCodeHandbookPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(148, 163, 184)
            self.cell(0, 8, "PREP-AI | LeetCode & FAANG DSA Master Handbook (58 Essential Solutions)", align="L")
            self.cell(0, 8, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
            self.set_draw_color(226, 232, 240)
            self.set_line_width(0.2)
            self.line(10, 18, 200, 18)
            self.ln(4)

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-14)
            self.set_font("helvetica", "I", 8)
            self.set_text_color(148, 163, 184)
            self.cell(0, 10, "PREP-AI Coding Platform  -  Full Stack, SDE & FAANG Interview Prep", align="C")

def generate_pdf():
    with open("scripts/problems_dump.json", "r") as f:
        problems = json.load(f)

    pdf = LeetCodeHandbookPDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(10, 15, 10)

    # ================= COVER PAGE =================
    pdf.add_page()
    pdf.set_fill_color(15, 23, 42)  # Dark Slate 900
    pdf.rect(0, 0, 210, 297, "F")

    # Accent decorative top bar
    pdf.set_fill_color(99, 102, 241)  # Indigo
    pdf.rect(0, 0, 210, 6, "F")

    pdf.set_y(50)
    pdf.set_font("helvetica", "B", 13)
    pdf.set_text_color(56, 189, 248)  # Cyan
    pdf.cell(0, 10, "PREP-AI TECHNICAL INTERVIEW SERIES", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("helvetica", "B", 28)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 15, "LeetCode Master Handbook", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("helvetica", "", 13)
    pdf.set_text_color(203, 213, 225)
    pdf.cell(0, 10, "58 Curated FAANG & Blind-75 Solutions with Intuition & Big-O", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(15)
    pdf.set_draw_color(56, 189, 248)
    pdf.set_line_width(0.8)
    pdf.line(40, 110, 170, 110)

    # Core Features List Card
    pdf.set_y(125)
    pdf.set_fill_color(30, 41, 59)
    pdf.rect(25, 125, 160, 100, "F")

    pdf.set_y(132)
    pdf.set_font("helvetica", "B", 11)
    pdf.set_text_color(56, 189, 248)
    pdf.cell(0, 8, "WHAT THIS HANDBOOK COVERS", align="C", new_x="LMARGIN", new_y="NEXT")

    features = [
        "15 Core DSA Topics: Arrays, Sliding Window, Trees, Graphs, DP...",
        "Optimal, Production-Ready Python Solutions with Syntax Highlighting",
        "Step-by-step Intuition & Algorithmic Thought Process",
        "Strict Big-O Time Complexity & Space Complexity Breakdowns",
        "Critical Edge Cases & Common FAANG Interview Pitfalls",
        "Target Companies: Google, Amazon, Meta, Microsoft, Apple, Uber"
    ]
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(226, 232, 240)
    pdf.set_y(146)
    for feat in features:
        pdf.set_x(32)
        pdf.cell(6, 7, "[x] ", align="L")
        pdf.cell(140, 7, feat, align="L", new_x="LMARGIN", new_y="NEXT")

    # Author / Platform Footer on cover
    pdf.set_y(250)
    pdf.set_font("helvetica", "I", 9)
    pdf.set_text_color(148, 163, 184)
    pdf.cell(0, 6, "Designed & Generated for PREP-AI Coding Arena Users", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "https://prepai.vercel.app  -  Pair Programming & Mock Interviews", align="C", new_x="LMARGIN", new_y="NEXT")

    # ================= TABLE OF CONTENTS =================
    pdf.add_page()
    pdf.set_font("helvetica", "B", 18)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "Table of Contents - 58 Curated Problems", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    categories = {}
    for p in problems:
        cat = p["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(p)

    for cat_name, cat_probs in categories.items():
        pdf.set_font("helvetica", "B", 11)
        pdf.set_text_color(79, 70, 229)  # Indigo
        pdf.cell(0, 7, f"{cat_name.upper()} ({len(cat_probs)} Problems)", new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("helvetica", "", 8.5)
        pdf.set_text_color(51, 65, 85)
        col_w = 95
        for i in range(0, len(cat_probs), 2):
            p1 = cat_probs[i]
            diff1 = p1['difficulty']
            txt1 = f"#{p1['number']} {p1['title']} [{diff1}]"
            pdf.cell(col_w, 5, sanitize_text(txt1[:50]), align="L")

            if i + 1 < len(cat_probs):
                p2 = cat_probs[i + 1]
                diff2 = p2['difficulty']
                txt2 = f"#{p2['number']} {p2['title']} [{diff2}]"
                pdf.cell(col_w, 5, sanitize_text(txt2[:50]), align="L", new_x="LMARGIN", new_y="NEXT")
            else:
                pdf.ln(5)
        pdf.ln(2)

    # ================= DETAILED PROBLEMS & SOLUTIONS =================
    for p in problems:
        pid = p["id"]
        pnum = p["number"]
        title = p["title"]
        difficulty = p["difficulty"]
        category = p["category"]
        companies = ", ".join(p.get("companies", [])[:4])
        desc = p["desc"]
        constraints = p.get("constraints", "")
        sol = SOLUTIONS_DATA.get(pid, {
            "approach": "Optimal Algorithmic Solution",
            "intuition": "Analyze constraints, identify optimal pattern, apply boundary checks.",
            "time": "O(N)",
            "space": "O(1)",
            "edgeCases": "Empty input, boundary limits, duplicates.",
            "code": p["starterCode"].get("python", "# Solution code")
        })

        pdf.add_page()

        # Problem Header Banner
        pdf.set_fill_color(248, 250, 252)
        pdf.rect(10, 18, 190, 16, "F")
        pdf.set_draw_color(226, 232, 240)
        pdf.rect(10, 18, 190, 16, "D")

        pdf.set_xy(12, 20)
        pdf.set_font("helvetica", "B", 13)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(140, 6, sanitize_text(f"#{pnum}. {title}"), align="L")

        # Difficulty Badge
        if difficulty == "Easy":
            pdf.set_fill_color(209, 250, 229)
            pdf.set_text_color(5, 150, 105)
        elif difficulty == "Medium":
            pdf.set_fill_color(254, 243, 199)
            pdf.set_text_color(217, 119, 6)
        else:
            pdf.set_fill_color(255, 228, 230)
            pdf.set_text_color(225, 29, 72)
        
        pdf.set_xy(160, 21)
        pdf.set_font("helvetica", "B", 9)
        pdf.cell(35, 6, difficulty.upper(), align="C", fill=True)

        # Category and Companies Sub-header
        pdf.set_xy(12, 27)
        pdf.set_font("helvetica", "I", 8.5)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(0, 5, sanitize_text(f"Category: {category}   |   Frequently Asked At: {companies}"), new_x="LMARGIN", new_y="NEXT")

        pdf.ln(3)

        # Problem Description
        pdf.set_font("helvetica", "B", 9.5)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 5, "Problem Statement:", new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("helvetica", "", 8.5)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(190, 4.5, sanitize_text(desc))

        if constraints:
            pdf.set_font("helvetica", "I", 7.5)
            pdf.set_text_color(100, 116, 139)
            pdf.cell(0, 4, sanitize_text(f"Constraints: {constraints}"), new_x="LMARGIN", new_y="NEXT")

        pdf.ln(2)

        # Intuition & Approach
        pdf.set_fill_color(241, 245, 249)
        pdf.set_draw_color(203, 213, 225)
        pdf.rect(10, pdf.get_y(), 190, 22, "F")
        pdf.rect(10, pdf.get_y(), 190, 22, "D")

        y_box = pdf.get_y()
        pdf.set_xy(12, y_box + 1.5)
        pdf.set_font("helvetica", "B", 9)
        pdf.set_text_color(79, 70, 229)
        pdf.cell(0, 4.5, sanitize_text(f"Optimal Approach: {sol['approach']}"), new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(12, y_box + 6.5)
        pdf.set_font("helvetica", "", 8)
        pdf.set_text_color(30, 41, 59)
        pdf.multi_cell(186, 3.8, sanitize_text(sol["intuition"]))

        pdf.set_y(y_box + 24)

        # Complexity Analysis Bar
        pdf.set_fill_color(238, 242, 255)
        pdf.rect(10, pdf.get_y(), 190, 10, "F")
        pdf.set_xy(12, pdf.get_y() + 1)
        pdf.set_font("helvetica", "B", 8)
        pdf.set_text_color(67, 56, 202)
        pdf.cell(90, 4, sanitize_text(f"Time Complexity: {sol['time']}"), align="L")
        pdf.cell(90, 4, sanitize_text(f"Space Complexity: {sol['space']}"), align="L", new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(12, pdf.get_y())
        pdf.set_font("helvetica", "I", 7.5)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(180, 4, sanitize_text(f"Edge Cases: {sol['edgeCases']}"), align="L", new_x="LMARGIN", new_y="NEXT")

        pdf.ln(3)

        # Python Code Box
        pdf.set_font("helvetica", "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 5, "Optimal Python Solution:", new_x="LMARGIN", new_y="NEXT")

        code_lines = sol["code"].split("\n")
        pdf.set_fill_color(15, 23, 42)  # Dark IDE background
        code_box_h = min(len(code_lines) * 4.2 + 6, 120)
        curr_y = pdf.get_y()
        pdf.rect(10, curr_y, 190, code_box_h, "F")

        pdf.set_xy(13, curr_y + 3)
        pdf.set_font("courier", "", 7.8)
        pdf.set_text_color(248, 250, 252)

        for line in code_lines:
            pdf.set_x(13)
            pdf.cell(184, 4, sanitize_text(line), align="L", new_x="LMARGIN", new_y="NEXT")

    out_path = "public/PREP-AI_LeetCode_Master_Solutions.pdf"
    pdf.output(out_path)
    print(f"Successfully generated PDF: {out_path} ({pdf.page_no()} pages)")

if __name__ == "__main__":
    generate_pdf()

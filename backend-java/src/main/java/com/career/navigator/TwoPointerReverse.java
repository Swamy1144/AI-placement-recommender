public class TwoPointerReverse {
    public static void main(String[] args) {
        char[] skills = { 'J', 'a', 'v', 'a', '2', '1' };

        int left = 0;
        int right = skills.length - 1;

        while (left < right) {
            // Swap elements
            char temp = skills[left];
            skills[left] = skills[right];
            skills[right] = temp;

            // Move pointers toward middle
            left++;
            right--;
        }

        System.out.println(String.valueOf(skills)); // Output: 12avaJ
    }
}